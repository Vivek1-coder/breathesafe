// const { GoogleGenerativeAI } = require("@google/generative-ai");

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
try {
    const { ppm } = await req.json();

    if (!ppm || !Array.isArray(ppm)) {
      return NextResponse.json({ error: "Invalid input: ppm should be an array" }, { status: 400 });
    }

    // Convert ppm array into a string to be included in the prompt
    const ppmString = `{${ppm.join(", ")}}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `The air quality index (AQI) of my home is ${ppmString}. The AQI is very high and falls in the hazardous range. I want to improve the indoor air quality. Provide five scientifically-backed and quantified ways to improve the air quality in my home. Each suggestion should include its effectiveness in reducing AQI (in numerical terms) and implementation details on how to use it effectively. Additionally, suggest air-purifying plants that can help reduce AQI, specifying the plant names, the number of plants required for a 200-300 sq. ft. room, and how each plant helps in air purification. The response should in a single string where each main point is separated by \"///\" and each subpoint is separated by \"~\" and the heading of each point wrapped between \"#\".`;
    
    const result = await model.generateContent(prompt);
        const response = await result.response;
        const output = await response.text();
        console.log(result);
        return NextResponse.json({output:output})
} catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
}