import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function askGemini(message: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
  const result = await model.generateContent([message]);
  return result.response.text();
}
