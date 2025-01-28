import mongoose from "mongoose";

const GasSchema = new mongoose.Schema({
  ppm: Number,
  timestamp: { type: Date, default: Date.now },
});

const Gas = mongoose.models.Gas || mongoose.model("Gas", GasSchema);

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ppm } = req.body;

    if (!ppm) {
      return res.status(400).json({ error: "Invalid data" });
    }

    await connectToDatabase();
    const newGasData = new Gas({ ppm });
    await newGasData.save();
    return res.status(200).json({ message: "Data saved successfully" });
  }

  res.status(405).json({ error: "Method not allowed" });
}
