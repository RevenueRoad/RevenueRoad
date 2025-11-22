import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log("Welcome! Let's create your personalized financial roadmap.\n");

  const userInput = await rl.question("Tell me about your financial goal, income, expenses, and contribution plan: \n");

  rl.close();

  //Extract structured info from freeform text
  const extractionPrompt = `
You are a financial assistant.
Extract the following info from the user's text:
- total_target (how much they want to save)
- contribution_frequency (e.g., weekly, bi-weekly, monthly)
- annual_income
- monthly_expenses

Output strictly in JSON format.

User text: ${userInput}
`;

const extractionResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: extractionPrompt
  });
  
  if (!extractionResponse.text) {
    console.error("No text returned from Gemini for extraction.");
    return;
  }
  
  // Remove Markdown formatting (triple backticks, "json" label, etc.)
  const cleanText = extractionResponse.text
    .replace(/```json/, '')
    .replace(/```/g, '')
    .trim();
  
  let extractedData;
  try {
    extractedData = JSON.parse(cleanText);
  } catch (err) {
    console.error("Failed to parse JSON from Gemini:", cleanText);
    return;
  }  

  //Generate roadmap
  const roadmapPrompt = `
You are a robotic financial coach for beginners. Do not greet the user or say anything extra. Literally only generate the things you need to in the most minimal way possible.
The user wants a main financial goal and a checklist of actionable tasks.
Use the following data:
- Total Target: ${extractedData.total_target}
- Contribution Frequency: ${extractedData.contribution_frequency}
- Annual Income: ${extractedData.annual_income}
- Monthly Expenses: ${extractedData.monthly_expenses}

Generate:
1. A main goal statement
2. A numbered list of actionable tasks with amounts and target dates, ready to be checked off
Use simple, beginner-friendly language. Format like this:

Main Goal: ...
Tasks:
1. ...
2. ...
...

The main goal should have the structure "Your Personalized [Whatever] Plan" (e.g., Your Personalized $20K RRSP Plan).
The Tasks should have the structure "Invest [however much] by [date]" (e.g, Invest $2000 by May 2) so you should note today's date and put the dates accordingly.
`;

  const roadmapResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: roadmapPrompt
  });

  console.log("\nHere’s your personalized financial roadmap:\n");
  console.log(roadmapResponse.text);
}

main();