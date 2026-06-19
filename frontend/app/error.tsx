"use client";

import { useEffect } from 'react';
import { RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center bg-background">
      <div className="relative mb-8">
        <h1 className="text-[120px] md:text-[180px] font-black leading-none text-white/5 select-none tracking-tighter">
          500
        </h1>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <p className="text-xl md:text-3xl font-bold uppercase tracking-widest text-red-600">
            Cut! Scene Failed
          </p>
        </div>
      </div>
      
      <p className="mb-10 max-w-lg text-neutral-400 text-lg">
        We encountered technical difficulties while loading this scene. Our crew is working behind the scenes to fix the issue.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-red-700 hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
        >
          <RotateCcw size={18} />
          Try Again
        </button>
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
        >
          <Home size={18} />
          Return Home
        </Link>
      </div>
    </div>
  );
}
