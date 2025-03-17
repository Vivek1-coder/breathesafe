import connectDB from "../../../../lib/dbConnect";
import Location from "../../../../models/Location.model";

export async function POST(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  await connectDB();

  try {
    const { name, latitude, longitude } =await req.json();
    if ( !name) {
      return Response.json({ message: "Name is required" },{status:404});
    }
    if ( !latitude || !longitude) {
      return Response.json({ message: "All fields are required." },{status:404});
    }

    const newLocation = new Location({
      name,
      coordinates: { type: "Point", coordinates: [longitude, latitude] },
    });

    await newLocation.save();
    return Response.json({ message: "Successfully location saved" },{status:201});
  } catch (error) {
    return Response.json({ message: "Internal Server Error" },{status:500});
  }
}
