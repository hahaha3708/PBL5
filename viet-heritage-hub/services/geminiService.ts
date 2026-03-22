import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCalligraphyMeaning = async (inputWord: string, style: string): Promise<string> => {
  try {
    const prompt = `
      You are a Vietnamese Calligraphy Master and Cultural Historian.
      The user wants to write the word/phrase: "${inputWord}" in the style of "${style}".
      
      Please provide:
      1. The Han-Nom or Vietnamese Quoc Ngu breakdown.
      2. The deep philosophical meaning behind this word in Vietnamese culture.
      3. A poetic instruction on how the brush strokes should flow (imagine you are teaching a student).
      4. A short 4-line poem (luc bat format if possible) containing this word.

      Format the response as clean Markdown.
      Keep the tone wise, serene, and artistic.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a wise guardian of Vietnamese Heritage.",
        temperature: 0.7,
      }
    });

    return response.text || "The ink is dry. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The spirits of the ancestors are quiet. Please check your connection and try again.";
  }
};
