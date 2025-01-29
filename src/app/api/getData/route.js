import mongoose from "mongoose";
import { DataModel } from "@/models/Data.model";



async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export  async function GET(req,res) {
 try {
   
       await connectToDatabase();
       const gasData = await DataModel.find().sort({ timestamp: -1 }).limit(10);

       return new Response(JSON.stringify({gasData}),{
        status:200,
       })
       
    
 } catch (error) {
    console.error('Error saving data:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
 }
}