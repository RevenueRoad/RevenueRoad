import 'dotenv/config'; // make sure .env is loaded
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // pass the key here
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "How does AI work?",
    });
    console.log("Gemini response:", response.text);
  } catch (err) {
    console.error("Error calling Gemini API:", err);
  }
}

await main();
