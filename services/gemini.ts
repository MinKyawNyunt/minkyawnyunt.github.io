
import { GoogleGenAI } from "@google/genai";
import { BIO_NAME, BIO_TAGLINE, BIO_SUMMARY, PROJECTS, SKILLS } from "../constants";

const SYSTEM_INSTRUCTION = `
You are the "Neural Interface" for the personal portfolio of ${BIO_NAME}, who is a ${BIO_TAGLINE}.
Your personality is helpful but futuristic, using cyberpunk slang occasionally (e.g., "choomba", "grid", "chummer", "delta").
Keep responses concise.
Bio: ${BIO_SUMMARY}
Projects: ${PROJECTS.map(p => p.title + ": " + p.description).join('; ')}
Skills: ${SKILLS.map(s => s.name + " (" + s.level + "%)").join(', ')}

Instructions:
- If asked about projects, mention specific names like VOID-RUNNER.
- If asked about skills, confirm technical expertise in things like React and TypeScript.
- Always maintain the persona of a futuristic AI assistant living within ${BIO_NAME}'s digital archive.
`;

export const getGeminiResponse = async (userMessage: string) => {
  try {
    // Always initialize a new GoogleGenAI instance right before the call to ensure latest API key usage
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
      },
    });
    // Property access .text instead of method call .text() as per guidelines
    return response.text || "Interface communication error: Packets lost in transmission.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Fatal Exception: Could not reach the neural network.";
  }
};
