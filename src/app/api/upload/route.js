import mongoose from 'mongoose';
import { DataModel } from '@/models/Data.model.js';

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
