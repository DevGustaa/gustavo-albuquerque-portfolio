import { ImageOff, Search } from "lucide-react";

interface ScreenshotPlaceholderProps {
  title: string;
  heading: string;
  message: string;
}

const bar = "rounded bg-zinc-700/70";

function SkeletonScreen() {
  return (
    <div
      aria-hidden="true"
      data-skeleton
      className="absolute inset-0 flex gap-2 p-3 opacity-60 blur-[1px]"
    >
      <div className="hidden w-1/6 flex-col gap-2 rounded-md border border-zinc-800 p-2 sm:flex">
        <div className={`h-2 w-3/4 ${bar}`} />
        <div className={`h-2 w-1/2 ${bar}`} />
        <div className={`h-2 w-2/3 ${bar}`} />
        <div className={`h-2 w-1/2 ${bar}`} />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between rounded-md border border-zinc-800 p-2">
          <div className={`h-2 w-1/4 ${bar}`} />
          <div className="h-3 w-3 rounded-full bg-brand-500/50" />
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2">
          <div className="rounded-md border border-zinc-800 bg-brand-500/10" />
          <div className="rounded-md border border-zinc-800" />
          <div className="rounded-md border border-zinc-800 bg-accent-400/5" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 rounded-md border border-zinc-800 p-2">
          <div className={`h-2 w-full ${bar}`} />
          <div className={`h-2 w-5/6 ${bar}`} />
          <div className={`h-2 w-2/3 ${bar}`} />
        </div>
      </div>
    </div>
  );
}

export function ScreenshotPlaceholder({
  title,
  heading,
  message,
}: ScreenshotPlaceholderProps) {
  return (
    <div
      data-testid="screenshot-unavailable"
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      <SkeletonScreen />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -mt-7 -ml-7 animate-search-roam motion-reduce:animate-none"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15 ring-2 ring-accent-400/80 backdrop-blur-[2px]">
          <Search className="h-6 w-6 text-accent-300" />
        </div>
      </div>
      <div className="relative mx-4 max-w-xs rounded-xl border border-zinc-700/80 bg-zinc-950/85 px-4 py-3 text-center shadow-lg shadow-black/40 backdrop-blur-sm">
        <p className="flex items-center justify-center gap-1.5 font-mono text-sm font-semibold text-accent-300">
          <ImageOff aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">{title}: </span>
          {heading}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-zinc-400 sm:text-xs">
          {message}
        </p>
      </div>
    </div>
  );
}
