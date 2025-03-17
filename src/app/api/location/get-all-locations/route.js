import connectDB from "../../../../lib/dbConnect";
import Location from "../../../../models/Location.model";

export async function GET(req) {
  try {
    await connectDB();
    
    // Fetch all locations from the Location model
    const locations = await Location.find({}, "name coordinates");

    return new Response(
      JSON.stringify({ locations }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching locations:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
