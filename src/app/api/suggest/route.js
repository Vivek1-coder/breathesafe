'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Set CORS headers
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*"); // Change "*" to your frontend URL for security
    headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle Preflight Request (CORS)
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers });
    }

    const { co2,pm1_0,pm2_5,pm10} = await req.json();

    if (!co2 || !Array.isArray(co2)) {
      return NextResponse.json({ error: "Invalid input: ppm should be an array" }, { status: 400 });
    }

    // Convert ppm array into a string to be included in the prompt
    const co2String = `{${co2.join(", ")}}`;
    const pm1_0String = `{${pm1_0.join(", ")}}`;
    const pm2_5String = `{${pm2_5.join(", ")}}`;
    const pm10String = `{${pm10.join(", ")}}`;


   

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `The co2 level of my home is ${co2String}, pm1.0 level is ${pm1_0String},pm2.5 level is ${pm2_5String} and pm10 level is ${pm10String}.If the levels are very high and falls in the hazardous range. I want to improve the indoor air quality. Provide five scientifically-backed and quantified ways to improve the air quality in my home. Each suggestion should include its effectiveness in reducing these levels (in numerical terms) and implementation details on how to use it effectively. Additionally, suggest air-purifying plants that can help improving air quality, specifying the plant names, the number of plants required for a 200-300 sq. ft. room, and how each plant helps in air purification. The response should be in a single string where each main point is separated by "///" and each subpoint is separated by "~" and the heading of each point wrapped between "#".`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = await response.text();

    return NextResponse.json({ output:output });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
