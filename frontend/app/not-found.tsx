import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center bg-background">
      <div className="relative mb-8">
        <h1 className="text-[120px] md:text-[180px] font-black leading-none text-white/5 select-none tracking-tighter">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <p className="text-xl md:text-3xl font-bold uppercase tracking-widest text-red-600">
            Lost in the Void
          </p>
        </div>
      </div>
      
      <p className="mb-10 max-w-lg text-neutral-400 text-lg">
        The movie or series you're looking for has been moved, deleted, or never existed in this cinematic universe.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-red-700 hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
        >
          <Home size={18} />
          Back to Home
        </Link>
        <Link 
          href="/search"
          className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
        >
          <Search size={18} />
          Search Catalog
        </Link>
      </div>
    </div>
  );
}
