const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

export const buttonStyles = {
  primary: `${base} bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-accent-400/40 hover:ring-2 hover:ring-accent-400/70`,
  secondary: `${base} border border-zinc-300 hover:-translate-y-0.5 hover:border-accent-500 hover:text-brand-600 dark:border-zinc-700 dark:hover:border-accent-400 dark:hover:text-accent-300`,
  ghost: `${base} text-zinc-600 hover:text-brand-600 dark:text-zinc-300 dark:hover:text-accent-300`,
};

export const iconButtonStyles =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-brand-500 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white";

export const tagStyles =
  "rounded-full border border-transparent bg-zinc-100 px-3 py-1 font-mono text-xs text-zinc-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-400 hover:bg-accent-200/50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-accent-400/10";
