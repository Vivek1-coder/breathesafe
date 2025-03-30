// const { GoogleGenerativeAI } = require("@google/generative-ai");
'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";

import { NextResponse } from "next/server";

export async function POST(req) {
try {
    const { co2,pm1_0,pm2_5,pm10} = await req.json();

    if (!co2 || !Array.isArray(co2)) {
      return NextResponse.json({ error: "Invalid input: ppm should be an array" }, { status: 400 });
    }

    // Convert ppm array into a string to be included in the prompt
    const co2String = `{${co2.join(", ")}}`;
    const pm1_0String = `{${pm1_0.join(", ")}}`;
    const pm2_5String = `{${pm2_5.join(", ")}}`;
    const pm10String = `{${pm10.join(", ")}}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `The co2 level of my home is ${co2String}, pm1.0 level is ${pm1_0String},pm2.5 level is ${pm2_5String} and pm10 level is ${pm10String}.If the level is very high and falls in the hazardous range then I want to protect my lungs from such a bad air quality. Provide five scientifically-backed and quantified ways to protect my health in such a situation. Each suggestion should include its effectiveness in protecting my health (in numerical terms) and implementation details on how to use it effectively.If the level is not so high give me a positive quote.The response should in a single string where each main point is separated by \"///\" and each subpoint is separated by \"~\" and the heading of each point wrapped between \"#\".`;
    
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