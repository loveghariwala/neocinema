export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950/80 backdrop-blur-xl">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Cinematic Glowing Rings */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Outer Ring (Red) */}
          <div className="absolute h-full w-full animate-spin rounded-full border-t-2 border-r-2 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]" style={{ animationDuration: '1.2s' }} />
          {/* Inner Ring (White/Gray) */}
          <div className="absolute h-16 w-16 animate-spin rounded-full border-b-2 border-l-2 border-white/20" style={{ animationDuration: '1.8s', animationDirection: 'reverse' }} />
          {/* Center Logo/Initial */}
          <span className="animate-pulse text-2xl font-black tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
            NC
          </span>
        </div>
        
        {/* Animated Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <div className="animate-pulse text-xs font-black tracking-[0.4em] text-red-500 uppercase drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
            Loading
          </div>
          <div className="flex gap-1">
            <div className="h-1 w-1 animate-bounce rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]" style={{ animationDelay: '0ms' }} />
            <div className="h-1 w-1 animate-bounce rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]" style={{ animationDelay: '150ms' }} />
            <div className="h-1 w-1 animate-bounce rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
