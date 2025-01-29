// Define schema and model
import mongoose from "mongoose";

export const DataSchema = new mongoose.Schema({
  ppm: Number,
  timestamp: { type: Date, default: Date.now },
});
export const DataModel = mongoose.models.Data || mongoose.model('Data', DataSchema);