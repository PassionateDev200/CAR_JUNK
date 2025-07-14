/** route: src/app/api/vehicle-data/models/route.js */
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");
    const year = searchParams.get("year");

    if (!make || !year) {
      return NextResponse.json(
        { error: "Make and year parameters are required" },
        { status: 400 }
      );
    }

    const yearNum = parseInt(year);

    if (yearNum >= 2023) {
      // Use CarAPI.app for 2023 and newer
      const response = await fetch(
        `https://carapi.app/api/models/v2?make=${make.toLowerCase()}&model_year=${year}`
      );

      if (!response.ok) {
        throw new Error(`CarAPI error: ${response.status}`);
      }

      const data = await response.json();
      const models = data.data.map((model) => ({
        model_name: model.name,
        model_make_id: model.make,
      }));

      return NextResponse.json({ Models: models });
    } else {
      // ===== FIXED: Updated CarQuery API call and JSONP parsing =====
      const response = await fetch(
        `https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModels&make=${make}&year=${year}&sold_in_us=1`
      );

      if (!response.ok) {
        throw new Error(`CarQuery error: ${response.status}`);
      }

      const text = await response.text();

      // ===== FIXED: Corrected regex pattern for JSONP parsing =====
      const jsonMatch = text.match(/^\?\((.*)\);?$/s);
      if (!jsonMatch) {
        // Try alternative patterns
        const altMatch1 = text.match(/^[^(]*\((.*)\)[^)]*$/s);
        const altMatch2 = text.match(/\{.*\}/s);

        if (altMatch1) {
          const data = JSON.parse(altMatch1[1]);
          return NextResponse.json(data);
        } else if (altMatch2) {
          const data = JSON.parse(altMatch2[0]);
          return NextResponse.json(data);
        } else {
          console.error("Failed to parse CarQuery response:", text);
          throw new Error("Invalid CarQuery response format");
        }
      }

      const data = JSON.parse(jsonMatch[1]);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle models", details: error.message },
      { status: 500 }
    );
  }
}
