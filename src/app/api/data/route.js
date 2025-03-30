import mongoose from "mongoose";
import { DataModel } from "../../../models/Data.model.js";

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const loc = searchParams.get("location");
    const date = searchParams.get("date");

    if (!loc || !date) {
      return new Response(JSON.stringify({ message: "Location and date are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log("date : ",date);
    // Convert the date to a proper UTC range
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    // console.log("Start Date (UTC):", startDate);
    // console.log("End Date (UTC):", endDate);

    // Fetch latest 10 records for reference
    // const gasData = await DataModel.find({
    //   locationName: loc,
    //   timestamp: { $gte: startDate, $lte: endDate },
    // })
    //   .sort({ timestamp: -1 })
    //   .limit(10);

    //   console.log("gasdata",gasData);
    // // Aggregate to get min & max values
    const minMaxData = await DataModel.aggregate([
      {
        $match: {
          locationName: loc,
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          min_co2: { $min: "$co2" },
          max_co2: { $max: "$co2" },
          min_pm1_0: { $min: "$pm1_0" },
          max_pm1_0: { $max: "$pm1_0" },
          min_pm2_5: { $min: "$pm2_5" },
          max_pm2_5: { $max: "$pm2_5" },
          min_pm10: { $min: "$pm10" },
          max_pm10: { $max: "$pm10" },
        },
      },
      
    ]);

    

    return new Response(
      JSON.stringify({
        
        minMaxValues: minMaxData.length > 0 ? minMaxData[0] : {},
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
