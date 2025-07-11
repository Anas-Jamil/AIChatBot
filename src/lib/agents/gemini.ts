import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function callGemini(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const result = await model.generateContent([
    {
      text: prompt,
    },
  ]);

  const output = await result.response.text();
  return output.trim() || "No response from Gemini";
}
