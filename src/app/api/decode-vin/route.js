/** route: src/app/api/decode-vin/route.js */
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const vin = searchParams.get("vin");

  if (!vin || vin.length !== 17) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid VIN format. VIN must be exactly 17 characters.",
        errorType: "INVALID_FORMAT",
      },
      { status: 400 }
    );
  }

  try {
    // Primary API: MarketCheck
    const marketCheckResponse = await fetch(
      `https://mc-api.marketcheck.com/v2/decode/car/${vin}/specs?api_key=${process.env.MARKETCHECK_API_KEY}`
    );

    const marketCheckData = await marketCheckResponse.json();
    console.log("MarketCheck API Response:", marketCheckData);

    // Handle the specific case you mentioned
    if (marketCheckData.is_valid === true && marketCheckData.code === 422) {
      console.log("MarketCheck unable to decode, trying fallback...");

      // Fallback 1: Try NHTSA API
      try {
        const nhtsaResponse = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
        );

        const nhtsaData = await nhtsaResponse.json();

        if (nhtsaData.Results && nhtsaData.Results.length > 0) {
          const results = nhtsaData.Results;

          // Extract relevant data from NHTSA response
          const extractValue = (variableName) => {
            const item = results.find((r) => r.Variable === variableName);
            return item?.Value || null;
          };

          const make = extractValue("Make");
          const model = extractValue("Model");
          const year = extractValue("Model Year");
          const trim = extractValue("Trim") || extractValue("Series");

          // Check if we got meaningful data
          if (make && model && year) {
            return NextResponse.json({
              make,
              model,
              year: year.toString(),
              trim,
              success: true,
              source: "NHTSA",
              message: "Decoded using NHTSA database",
            });
          }
        }
      } catch (nhtsaError) {
        console.error("NHTSA API error:", nhtsaError);
      }

      // Fallback 2: Basic VIN pattern recognition
      const basicDecoding = decodeVINBasic(vin);
      if (basicDecoding.success) {
        return NextResponse.json({
          ...basicDecoding,
          source: "Basic Pattern",
          message:
            "Partial decoding using VIN patterns. Please verify details.",
        });
      }

      // All methods failed
      return NextResponse.json(
        {
          success: false,
          error: "Unable to decode this VIN using any available method.",
          errorType: "DECODE_FAILED",
          suggestions: [
            "Verify the VIN is correct",
            "Try manual entry instead",
            "This might be a rare or specialty vehicle",
            "The vehicle might be too new or too old for our databases",
          ],
          vin: vin,
        },
        { status: 422 }
      );
    }

    // Normal MarketCheck success case
    if (marketCheckData.make && marketCheckData.model && marketCheckData.year) {
      return NextResponse.json({
        make: marketCheckData.make,
        model: marketCheckData.model,
        year: marketCheckData.year.toString(),
        trim: marketCheckData.trim,
        success: true,
        source: "MarketCheck",
      });
    }

    // MarketCheck returned data but incomplete
    return NextResponse.json(
      {
        success: false,
        error: "Incomplete vehicle data returned",
        errorType: "INCOMPLETE_DATA",
        partialData: marketCheckData,
      },
      { status: 422 }
    );
  } catch (error) {
    console.error("VIN decoding error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "VIN decoding service temporarily unavailable",
        errorType: "SERVICE_ERROR",
        suggestions: [
          "Please try again in a moment",
          "Use manual entry as an alternative",
        ],
      },
      { status: 503 }
    );
  }
}

// Basic VIN pattern decoding (fallback method)
function decodeVINBasic(vin) {
  try {
    // Extract year from 10th position
    const yearCode = vin.charAt(9);
    const yearMap = {
      A: 2010,
      B: 2011,
      C: 2012,
      D: 2013,
      E: 2014,
      F: 2015,
      G: 2016,
      H: 2017,
      J: 2018,
      K: 2019,
      L: 2020,
      M: 2021,
      N: 2022,
      P: 2023,
      R: 2024,
      S: 2025,
      T: 2026,
      V: 2027,
      W: 2028,
      X: 2029,
      Y: 2030,
      1: 2001,
      2: 2002,
      3: 2003,
      4: 2004,
      5: 2005,
      6: 2006,
      7: 2007,
      8: 2008,
      9: 2009,
    };

    // Basic manufacturer identification (WMI - first 3 characters)
    const wmi = vin.substring(0, 3);
    const manufacturerMap = {
      JHM: "Honda",
      "1HG": "Honda",
      "2HG": "Honda",
      "19X": "Honda",
      JH4: "Acura",
      "1J4": "Jeep",
      "1FA": "Ford",
      "1FT": "Ford",
      "1GC": "Chevrolet",
      "1G1": "Chevrolet",
      "4T1": "Toyota",
      "5NP": "Hyundai",
      KM8: "Hyundai",
      WBA: "BMW",
      WDD: "Mercedes-Benz",
    };

    const year = yearMap[yearCode];
    const make = manufacturerMap[wmi];

    if (year && make) {
      return {
        success: true,
        make,
        model: "Unknown Model",
        year: year.toString(),
        trim: null,
        isPartial: true,
      };
    }

    return { success: false };
  } catch (error) {
    return { success: false };
  }
}
