'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen w-full bg-[#0f111a] text-white flex flex-col items-center justify-center px-4 text-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        Welcome to <span className="text-purple-400">Apex</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg text-white/70 max-w-xl mb-8"
      >
        <span className="text-purple-400 text-xl">FGF Brands </span> Personal intelligent multi-agent AI assistant. Learn, plan, create, and chat with GPT-4o, Gemini, and more.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button
          onClick={() => router.push('/chat')}
          className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 text-base rounded-xl shadow-lg"
        >
          Start Chat
        </Button>
      </motion.div>
    </motion.div>
  );
}
