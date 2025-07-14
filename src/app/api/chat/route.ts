import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CohereClient } from 'cohere-ai';
import { sessionMemory } from '@/lib/store';
import fgfData from '@/data/fgf_knowledge.json';

function getFGFContext(message: string): string | null {
  const lower = message.toLowerCase();
  let matches: string[] = [];

  for (const entry of fgfData) {
    if (entry.keywords.some((keyword) => lower.includes(keyword))) {
      matches.push(entry.response);
    }
  }

  return matches.length > 0 ? matches.join('\n') : null;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get('x-session-id') || 'default';
  const { message, agent } = await req.json();

  if (!message || !agent) {
    return NextResponse.json({ error: 'Missing message or agent' }, { status: 400 });
  }

  // 🧠 Check for follow-up instructions
  const previousReply = sessionMemory[sessionId];
  if (previousReply && agent === 'auto') {
    const rewritePrompt = `Instruction: ${message}\n\nOriginal Text:\n${previousReply}`;
    const cohereResponse = await cohere.generate({
      model: 'command-r',
      prompt: rewritePrompt,
      temperature: 0.5,
      maxTokens: 300,
    });

    const reply = cohereResponse.generations[0].text;
    sessionMemory[sessionId] = reply;

    return NextResponse.json({
      reply,
      agent: 'Cohere + Instruction',
    });
  }

  try {
    let selectedAgent = agent;

    // 🔍 Auto agent routing
    if (agent === 'auto') {
      const routingPrompt = `
You are an intelligent routing assistant for a multi-agent AI chatbot. Based on the user's input, your job is to decide the **most appropriate AI model** from the following options:

- **GPT-4o**: Best for general knowledge, logical reasoning, multi-step problem-solving, math, and mixed-topic conversations.
- **Gemini 2.5**: Ideal for programming help, debugging code, software-related questions, and technical explanations.
- **Cohere**: Great at creative writing, improving tone and emotion in writing, rewriting sentences with personality, and generating human-like conversational responses.

Carefully read the user's input and determine which model is **most suitable**.

User's input:
"${message}"

Return **only one word** as your final answer:  
**gpt**, **gemini**, or **cohere**.
`;

      const result = await cohere.generate({
        model: 'command-r',
        prompt: routingPrompt,
        maxTokens: 5,
        temperature: 0.2,
      });

      const choice = result.generations[0].text.trim().toLowerCase();
      if (choice.includes('gemini')) selectedAgent = 'Gemini 2.5';
      else if (choice.includes('cohere')) selectedAgent = 'Cohere';
      else selectedAgent = 'GPT-4o';
    }

    // 💡 Inject FGF context
    const fgfContext = getFGFContext(message);
    const systemPrompt = fgfContext
      ? `You are a helpful assistant for FGF Brands. Here's relevant internal knowledge:\n\n${fgfContext}`
      : 'You are a helpful assistant.';

    // 🧠 GPT-4o
    if (selectedAgent === 'GPT-4o') {
      const chat = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
      });

      const reply = chat.choices[0]?.message?.content ?? 'No response';
      sessionMemory[sessionId] = reply;

      return NextResponse.json({
        reply,
        agent: fgfContext ? `${selectedAgent} + FGF` : selectedAgent,
      });
    }

    // 💻 Gemini
    if (selectedAgent === 'Gemini 2.5') {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      const result = await model.generateContent([message]);
      const reply = result.response.text();
      sessionMemory[sessionId] = reply;

      return NextResponse.json({ reply, agent: selectedAgent });
    }

    // ✍️ Cohere
    if (selectedAgent === 'Cohere') {
      const response = await cohere.chat({
        model: 'command-r',
        chatHistory: [
          { role: 'SYSTEM', message: systemPrompt },
          { role: 'USER', message },
        ],
        message,
      });

      const reply = response.text || 'No response';
      sessionMemory[sessionId] = reply;

      return NextResponse.json({
        reply,
        agent: fgfContext ? `${selectedAgent} + FGF` : selectedAgent,
      });
    }

    return NextResponse.json({ error: 'Unknown agent' }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
