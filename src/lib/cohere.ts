import cohere from 'cohere'

const co = cohere.Client({ apiKey: process.env.COHERE_API_KEY! });

export async function askCohere(message: string): Promise<string> {
  const res = await co.chat({
    model: 'command-light', // or 'command'
    messages: [{ role: 'user', content: message }],
  });
  return res.choices[0].message.content;
}