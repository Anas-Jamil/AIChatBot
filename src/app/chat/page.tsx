'use client';

import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Mic, Plus, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AgentKey = 'gpt4o' | 'claude' | 'gemini' | 'cohere';
type AgentLabel = 'GPT-4o' | 'Claude 3.5' | 'Gemini 2.5' | 'Cohere';

type Message = {
  text: string;
  sender: 'user' | 'agent';
  agent?: AgentLabel;
};

const agentOptions: Record<AgentKey, AgentLabel> = {
  gpt4o: 'GPT-4o',
  claude: 'Claude 3.5',
  gemini: 'Gemini 2.5',
  cohere: 'Cohere',
};

const quickActions = [
  'FGF Locations',
  'Learn something new',
  'Create an image',
  'Make a plan',
  'Brainstorm ideas',
  'Sales for the week',
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [agent, setAgent] = useState<AgentKey | 'auto'>('auto');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const isChatMode = messages.length > 0;

  const autoResize = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };

  const sendMessage = async (customText?: string) => {
    const prompt = customText ?? input;
    if (!prompt.trim()) return;

    const selectedAgent = agent === 'auto' ? routeAgent(prompt) : agentOptions[agent];
    const showAgentLabel = agent !== 'auto';

    const userMsg: Message = { text: prompt, sender: 'user' };
    const tempBotMsg: Message = {
      text: 'Thinking...',
      sender: 'agent',
      ...(showAgentLabel && { agent: selectedAgent }),
    };

    setMessages((prev) => [...prev, userMsg, tempBotMsg]);
    setInput('');
    setTimeout(() => inputRef.current?.style.setProperty('height', '48px'), 50);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': 'user-001' },
        body: JSON.stringify({ message: prompt, agent: selectedAgent }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          text: data.reply || 'No response',
          sender: 'agent',
          agent: selectedAgent,
        };
        return newMessages;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          text: 'Error communicating with the agent',
          sender: 'agent',
          agent: selectedAgent,
        };
        return newMessages;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'min-h-screen w-full bg-[#0f111a] text-white flex flex-col items-center transition-all duration-500 ease-in-out',
        isChatMode ? 'pt-6' : 'justify-center'
      )}
    >
      {!isChatMode && (
        <>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold mb-6 text-white"
          >
            What can I help you with today?
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="flex flex-wrap justify-center gap-3 max-w-2xl mb-36"
          >
            {quickActions.map((text, i) => (
              <motion.button
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                onClick={() => sendMessage(text)}
                className="px-4 py-2 rounded-full bg-white/5 text-sm text-white hover:bg-white/10 transition"
              >
                {text}
              </motion.button>
            ))}
          </motion.div>
        </>
      )}

      {isChatMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl mb-28 px-4 space-y-4"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[75%] p-3 rounded-xl text-sm',
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white border border-white/10'
                  )}
                >
                  {msg.sender === 'agent' && msg.agent && (
                    <div className="text-xs text-purple-400 font-semibold mb-1">{msg.agent}</div>
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="fixed bottom-6 w-full max-w-3xl px-4"
      >
        <div className="bg-[#1e1f2b] border border-white/10 shadow-lg rounded-2xl p-4 flex items-end gap-3 backdrop-blur-lg">
          <Select value={agent} onValueChange={(v) => setAgent(v as AgentKey | 'auto')}>
            <SelectTrigger className="w-[120px] text-white bg-white/10 border-white/20 rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-white border-zinc-700">
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="gpt4o">GPT-4o</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="cohere">Cohere</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={autoResize}
            placeholder="Ask Apex"
            className="flex-1 resize-none min-h-[48px] max-h-[160px] overflow-hidden bg-transparent text-white border-none focus:ring-0"
          />

          <div className="flex items-center gap-2">
            <Button size="icon" className="rounded-full bg-zinc-700 hover:bg-zinc-600">
              <Plus size={18} />
            </Button>
            <Button
              onClick={() => sendMessage()}
              size="icon"
              className="rounded-full bg-purple-600 hover:bg-purple-700"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function routeAgent(text: string): AgentLabel {
  const lower = text.toLowerCase();
  if (lower.includes('summary') || lower.includes('analyze')) return 'Claude 3.5';
  if (lower.includes('code') || lower.includes('debug')) return 'Gemini 2.5';
  if (lower.includes('chat') || lower.includes('tone')) return 'Cohere';
  return 'GPT-4o';
}
