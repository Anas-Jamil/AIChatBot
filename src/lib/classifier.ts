import { GoogleGenAI } from "@google/genai";

export async function classifyQuery(
  prompt: string,
  input?: { image?: any; audio?: any}
): Promise<string> {
  if (input?.image || input?.audio) return "multimodal";

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

  const response = await ai.models.generateContent({
    model: "gemma-3-27b-it",
    contents: [
      {
        parts: [
          {
            text: `Classify the user's request into one of: multimodal, summarization, long-context, coding, google-docs, general.\n\nPrompt: ${prompt}`,
          },
        ],
      },
    ],
  });

  const genre = response.text?.trim().toLowerCase();
  return genre || "general";
}
