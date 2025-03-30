import mongoose from "mongoose";

export const DataSchema = new mongoose.Schema({
  co2: { type: Number, required: true },  // MQ135 - CO2 concentration
  pm1_0: { type: Number, required: true }, // PMS5003 - PM1.0
  pm2_5: { type: Number, required: true }, // PMS5003 - PM2.5
  pm10: { type: Number, required: true },  // PMS5003 - PM10
  locationName: { type: String, default: null }, // Optional: Nearby location
  timestamp: { type: Date, default: Date.now() },
});

export const DataModel = mongoose.models.Data || mongoose.model("Data", DataSchema);
