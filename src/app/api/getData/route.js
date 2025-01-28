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

export  async function GET(req, res) {
  if (req.method === "GET") {
    await connectToDatabase();
    const gasData = await Gas.find().sort({ timestamp: -1 }).limit(10);
    return res.status(200).json(gasData);
  }

  res.status(405).json({ error: "Method not allowed" });
}