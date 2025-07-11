'use client';

import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Mic, Plus } from 'lucide-react';

type Message = {
  text: string;
  sender: 'user' | 'agent';
  agent?: 'GPT-4o' | 'Claude 3.5' | 'Gemini 1.5';
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
  const [agent, setAgent] = useState<'auto' | 'gpt4o' | 'claude' | 'gemini'>('auto');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const isChatMode = messages.length > 0;

  const autoResize = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { text: input, sender: 'user' };
    const selected = agent === 'auto' ? routeAgent(input) : formatAgent(agent);
    const botMsg: Message = {
      text: `Response from ${selected}`,
      sender: 'agent',
      agent: selected,
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg]);
    }, 600);

    setInput('');
    setTimeout(() => {
      inputRef.current?.style.setProperty('height', '48px');
    }, 50);
  };

  return (
    <div className={cn(
      'min-h-screen w-full bg-[#0f111a] text-white flex flex-col items-center transition-all duration-500 ease-in-out',
      isChatMode ? 'pt-6' : 'justify-center'
    )}>
      {/* Top content only in default mode */}
      {!isChatMode && (
        <>
          <h1 className="text-2xl font-semibold mb-6 text-white">
            What can I help you with today?
          </h1>

          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mb-36">
            {quickActions.map((text, i) => (
              <button
                key={i}
                className="px-4 py-2 rounded-full bg-white/5 text-sm text-white hover:bg-white/10 transition"
              >
                {text}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Chat messages (optional — only show in chat mode) */}
      {isChatMode && (
        <div className="w-full max-w-3xl mb-28 px-4 space-y-4 transition-all">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[75%] p-3 rounded-xl text-sm',
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white border border-white/10'
              )}>
                {msg.sender === 'agent' && (
                  <div className="text-xs text-purple-400 font-semibold mb-1">{msg.agent}</div>
                )}
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating input bar */}
      <div className="fixed bottom-6 w-full max-w-3xl px-4">
        <div className="bg-[#1e1f2b] border border-white/10 shadow-lg rounded-2xl p-4 flex items-end gap-3 backdrop-blur-lg">
          {/* Agent Select */}
          <Select value={agent} onValueChange={(v) => setAgent(v as any)}>
            <SelectTrigger className="w-[120px] text-white bg-white/10 border-white/20 rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-white border-zinc-700">
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="gpt4o">GPT-4o</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
            </SelectContent>
          </Select>

          {/* Textarea */}
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={autoResize}
            placeholder="Ask MetaAgent anything..."
            className="flex-1 resize-none min-h-[48px] max-h-[160px] overflow-hidden bg-transparent text-white border-none focus:ring-0"
          />

          {/* Send / Mic */}
          <div className="flex items-center gap-2">
            <Button onClick={sendMessage} size="icon" className="rounded-full bg-purple-600 hover:bg-purple-700">
              <Plus size={18} />
            </Button>
            <Button size="icon" variant="ghost" className="hover:bg-white/10">
              <Mic size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function routeAgent(text: string): 'GPT-4o' | 'Claude 3.5' | 'Gemini 1.5' {
  const lower = text.toLowerCase();
  if (lower.includes('summary') || lower.includes('analyze')) return 'Claude 3.5';
  if (lower.includes('code') || lower.includes('debug')) return 'Gemini 1.5';
  return 'GPT-4o';
}

function formatAgent(key: string): 'GPT-4o' | 'Claude 3.5' | 'Gemini 1.5' {
  if (key === 'claude') return 'Claude 3.5';
  if (key === 'gemini') return 'Gemini 1.5';
  return 'GPT-4o';
}
