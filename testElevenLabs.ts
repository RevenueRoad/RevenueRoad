// Import env files
import "dotenv/config"
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Pass Gemini API Key.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Pass ElevenLabs API
const client = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
        environment: "https://api.elevenlabs.io/",
    });

async function main() {
    try {
        // Use Gemini 2.5 Model.
        const roadmapResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "How does AI work?",
        });

        // Store text needed to be converted.
        const textToSpeech = roadmapResponse.text;

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

    fs.writeFileSync("geminiAudio.mp3", audioBuffer);
    console.log("Audio saved as geminiAudio.mp3")
  } catch (err) {
    console.error("Error calling Gemini API:", err);
  }
}
await main();
