// Define schema and model
import mongoose from "mongoose";

export const DataSchema = new mongoose.Schema({
  ppm: { type: Number, required: true },
  locationName: { type: String, default: null }, // Store nearby location name if found
  timestamp: { type: Date, default: Date.now },
});

export const DataModel = mongoose.models.Data || mongoose.model("Data", DataSchema);
