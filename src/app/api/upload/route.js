import mongoose from "mongoose";
import connectDB from "../../../lib/dbConnect";
import { DataModel } from "../../../models/Data.model";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req) {
  try {
    console.log("🛠️ API HIT: Received a request!");

    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    await connectDB();
    console.log("✅ Connected to MongoDB");

    const body = await req.json();
    console.log("Received data:", body);

    // Validate required fields
    if (
      body.co2 === undefined || 
      body.pm1_0 === undefined || 
      body.pm2_5 === undefined || 
      body.pm10 === undefined || 
      body.latitude === undefined || 
      body.longitude === undefined
    ) {
      return new Response(JSON.stringify({ message: "All sensor values (co2, pm1_0, pm2_5, pm10, temperature, humidity), latitude, and longitude are required." }), {
        status: 400,
        headers,
      });
    }

    // Fetch location name from get-location API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/location/get-location?latitude=${body.latitude}&longitude=${body.longitude}`
    );
    const locationData = await response.json();

    // Create new data entry
    const newData = new DataModel({
      co2: body.co2,
      pm1_0: body.pm1_0,
      pm2_5: body.pm2_5,
      pm10: body.pm10,
      locationName: locationData.locationName,
    });

    await newData.save();

    return new Response(
      JSON.stringify({ message: "✅ Data saved successfully!", locationName: locationData.locationName }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error("❌ Error saving data:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}
