import mongoose from "mongoose";
import connectDB from "../../../lib/dbConnect";
import { DataModel } from "../../../models/Data.model";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",  // Allow all origins
      "Access-Control-Allow-Methods": "POST, OPTIONS",  // Allowed methods
      "Access-Control-Allow-Headers": "Content-Type",  // Allowed headers
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

    if (!body.ppm || !body.latitude || !body.longitude) {
      return new Response(JSON.stringify({ message: "ppm, latitude, and longitude are required." }), {
        status: 400,
        headers,
      });
    }

    // Fetch location name from get-location route
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/location/get-location?latitude=${body.latitude}&longitude=${body.longitude}`
    );
    const locationData = await response.json();

    const newData = new DataModel({
      ppm: body.ppm,
      locationName: locationData.locationName,
    });

    await newData.save();

    return new Response(
      JSON.stringify({ message: "Data saved successfully!", locationName: locationData.locationName }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error("Error saving data:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}
