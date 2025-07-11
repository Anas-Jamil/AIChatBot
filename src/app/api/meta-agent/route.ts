import { NextRequest, NextResponse } from "next/server";
import { callGPT4o } from "@/lib/agents/gpt4o"
import { callClaude } from "@/lib/agents/claude";
import { callGemini } from "@/lib/agents/gemini";
import { classifyQuery } from "@/lib/classifier";

export async function POST(req: NextRequest) {
  const { prompt, image} = await req.json();

  const genre = await classifyQuery(prompt, { image });

  let response;

  switch (genre) {
    case "multimodal":
      response = await callGPT4o(prompt, image);
      break;
    case "summarization":
    case "long-context":
      response = await callClaude(prompt);
      break;
    case "coding":
    case "google-docs":
      response = await callGemini(prompt);
      break;
    default:
      response = await callGPT4o(prompt);
      break;
  }

  return NextResponse.json({ agent: genre, output: response });
}
