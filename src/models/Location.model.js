import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
});

LocationSchema.index({ coordinates: "2dsphere" }); // Geospatial index

export default mongoose.models.Location || mongoose.model("Location", LocationSchema);
