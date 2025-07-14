
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const year = searchParams.get("year");

    if (!make || !model || !year) {
      return NextResponse.json(
        { error: "Make, model, and year parameters are required" },
        { status: 400 }
      );
    }

    // ===== FIXED: Updated CarQuery API call and JSONP parsing =====
    const response = await fetch(
      `https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=${make}&model=${model.toLowerCase()}&year=${year}&sold_in_us=1`
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
        // Return empty trims array instead of error (trims are optional)
        return NextResponse.json({ Trims: [] });
      }
    }

    const data = JSON.parse(jsonMatch[1]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching trims:", error);
    // Return empty trims array instead of error (trims are optional)
    return NextResponse.json({ Trims: [] });
  }
}
