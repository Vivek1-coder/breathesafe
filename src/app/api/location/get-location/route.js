import connectDB from "../../../../lib/dbConnect";
import Location from "../../../../models/Location.model";

// Function to calculate distance between two lat/lon points
const isWithin1km = (loc1, loc2) => {
  const R = 6371; // Radius of Earth in km
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.latitude)) *
      Math.cos(toRad(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c <= 1; // Returns true if distance ≤ 1km
};

export async function GET(req, res) {
  if (req.method !== "GET") {
    return Response.json({ message: "Method not allowed" },{status:405});
  }

  await connectDB();

  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const latitude = parseFloat(searchParams.get("latitude"));
    const longitude = parseFloat(searchParams.get("longitude"));

    if (isNaN(latitude) || isNaN(longitude)) {
      return Response.json({ message: "All fields are required." },{status:404});
    }

    const locations = await Location.find();

    for (const location of locations) {
      if (
        isWithin1km(
          { latitude, longitude },
          {
            latitude: location.coordinates.coordinates[1],
            longitude: location.coordinates.coordinates[0],
          }
        )
      ) {
        return Response.json({ message: "Location found",locationName:location.name },{status:201});
      }
    }

    return Response.json({ message: "No location found" },{status:404});
  } catch (error) {
    console.error("Error fetching location:", error);
    return Response.json({ message: "Internal server error." },{status:500});
  }
}
