'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Brain, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0f111a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">MetaAgent</span>
        </Link>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="text-white hover:bg-white/10"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;