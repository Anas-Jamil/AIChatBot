'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const defaultModels = [
  {
    id: 'GPT-4o',
    description:
      'General knowledge, complex reasoning, casual conversation, math, and multi-topic tasks.',
  },
  {
    id: 'Gemini 2.5',
    description:
      'Coding help, debugging, technical explanations, developer tools, and software walkthroughs.',
  },
  {
    id: 'Cohere',
    description:
      'Creative writing, conversational tone, tone rewriting, brand voice, and emotional writing.',
  },
];

export default function AdminControlPage() {
  const [models, setModels] = useState(defaultModels);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'Cohere',
          message: '__ADMIN_ROUTING_UPDATE__',
          routingModels: models,
        }),
      });

      const data = await res.json();
      setMessage(data.success ? '✅ Preferences updated.' : '❌ Failed to update preferences.');
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Error submitting preferences.');
    } finally {
      setLoading(false);
    }
  };

  const updateModelDescription = (id: string, newDesc: string) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, description: newDesc } : m))
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#0f111a] px-6 md:px-10 py-10 text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white">
          Admin: Routing Preferences
        </h1>
        <p className="text-white/70 text-center">
          Define what each model should specialize in so auto-routing can make smarter decisions.
        </p>

        <div className="space-y-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 shadow-md"
            >
              <h2 className="text-lg font-semibold text-purple-300">{model.id}</h2>
              <Textarea
                className="bg-transparent text-white border border-white/20 focus:ring-1 focus:ring-purple-500 min-h-[100px]"
                value={model.description}
                onChange={(e) => updateModelDescription(model.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>

        {message && (
          <div
            className={cn(
              'text-sm mt-2 text-center',
              message.includes('✅') ? 'text-green-400' : 'text-red-400'
            )}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
