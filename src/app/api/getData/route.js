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

    // Extract query parameters (location & date)
    const { searchParams } = new URL(req.url);
    const loc = searchParams.get("loc");
    const date = searchParams.get("date");

    if (!loc || !date) {
      return new Response(JSON.stringify({ message: "Location and date are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ensure date is in UTC (matches MongoDB storage format)
    const startDate = new Date(`${date}T00:00:00.000Z`); // UTC start
    const endDate = new Date(`${date}T23:59:59.999Z`); // UTC end

    console.log("Start Date (UTC):", startDate);
    console.log("End Date (UTC):", endDate);

    // Query MongoDB with corrected UTC dates
    const gasData = await DataModel.find({
      locationName: { $regex: new RegExp("^" + loc + "$", "i") }, // Case-insensitive match
      timestamp: { $gte: startDate, $lte: endDate },
    })
      .sort({ timestamp: -1 })
      .limit(10);

    console.log("Fetched Data:", gasData);

    return  Response.json({gasdata: gasData }, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
