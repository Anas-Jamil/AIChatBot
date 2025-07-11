import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callGPT4o(prompt: string, image?: string) {
  const content: OpenAI.Chat.ChatCompletionContentPart[] = [
    { type: "text", text: prompt },
  ];

  if (image) {
    content.push({
      type: "image_url",
      image_url: {
        url: image,
      },
    } as OpenAI.Chat.ChatCompletionContentPartImage);
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "user",
      content,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.7,
  });

  return completion.choices[0].message?.content?.trim() || "No response";
}
