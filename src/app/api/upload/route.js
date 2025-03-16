import mongoose from "mongoose";
import connectDB from "../../../lib/dbConnect";
import { DataModel } from "../../../models/Data.model";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Received data:", body);

    if (!body.ppm || !body.latitude || !body.longitude) {
      return new Response(JSON.stringify({ message: "ppm, latitude, and longitude are required." }), { status: 400 });
    }

    // Fetch location name from get-location route
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/location/get-location?latitude=${body.latitude}&longitude=${body.longitude}`
      );
      const locationData = await response.json();
     
        const newData = new DataModel({ 
          ppm: body.ppm, 
          locationName: locationData.locationName
        });
    
        await newData.save();
     
  
      return new Response(JSON.stringify({ message: "Data saved successfully!", locationName: locationData.locationName }), {
        status: 200,
      });
   
    
    
  } catch (error) {
    console.error("Error saving data:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
