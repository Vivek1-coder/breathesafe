import mongoose from 'mongoose';

// MongoDB connection
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  }
};

// Define schema and model
export const DataSchema = new mongoose.Schema({
  ppm: Number,
  timestamp: { type: Date, default: Date.now },
});
export const DataModel = mongoose.models.Data || mongoose.model('Data', DataSchema);

// API handler
export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json(); // Parse JSON body
    console.log('Received data:', body);

    const newData = new DataModel({ ppm: body.ppm });
    await newData.save();

    return new Response(JSON.stringify({ message: 'Data saved successfully!' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error saving data:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
  }
}
