'use client';

import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0f111a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-center"> {/* Center logo */}
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Apex Logo"
            className="h-10 w-10 rounded-md object-contain"
          />
          <span className="text-xl font-semibold text-white">Apex</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
