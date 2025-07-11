import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function callClaude(prompt: string) {
  const response = await anthropic.messages.create({
    model: "claude-3.5-sonnet-20240620",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textBlocks = (response.content || []).filter(
    (block) => block.type === "text"
  ) as { type: "text"; text: string }[];

  const text = textBlocks.map((block) => block.text).join("\n");

  return text.trim() || "No response from Claude";
}
