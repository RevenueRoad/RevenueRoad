// Import env files
import "dotenv/config"
import fs from "fs";
import { generateRoadmap } from "./index.ts";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

//mongodb code 
import { Binary } from "mongodb"; 
import clientPromise from "./mongo.ts";
//save audio files 
export async function saveAudio(audioBuffer: Buffer, text: string) {
  const client = await clientPromise;
  const db = client.db("revenue_db");

  return db.collection("audio_files").insertOne({
    audio: new Binary(audioBuffer),
    text,
    createdAt: new Date(),
  });
}

// Pass ElevenLabs API
const client = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
        environment: "https://api.elevenlabs.io/",
    });

async function main() {
    try {
        // Store text needed to be converted.
        const textToSpeech = await generateRoadmap();

        // Need this if condition to account for response.text being undefined.
        if (!textToSpeech) {
            throw new Error("Gemini did not return any text.")
        }

        // Write text to console.
        console.log("Gemini response:", textToSpeech);

        // Convert text to speech.
        const audioStream = await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
        outputFormat: "mp3_44100_128",
        text: textToSpeech,
        modelId: "eleven_multilingual_v2",
    });

    const blocks: Uint8Array[] = [];
    const reader = audioStream.getReader();

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        blocks.push(value);
    }

    const audioBuffer = Buffer.concat(blocks)

    fs.writeFileSync("amazingFinancialAdvice.mp3", audioBuffer);
    console.log("Audio saved as amazingFinancialAdvice.mp3")

    //connect to mongoDB
    const result = await saveAudio(audioBuffer, textToSpeech);
    console.log("Audio saved to MongoDB with ID:", result.insertedId);
  } catch (err) {
    console.error("Error calling Gemini API:", err);
  }
}
await main();

