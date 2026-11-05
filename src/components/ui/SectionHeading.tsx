import { Reveal } from "../fx/Reveal";

interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ id, title, subtitle }: SectionHeadingProps) {
  return (
    <Reveal as="header" className="mb-10">
      <span
        aria-hidden="true"
        className="mb-4 block h-1 w-12 rounded-full bg-gradient-to-r from-brand-600 to-accent-400"
      />
      <h2 id={id} className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-zinc-600 dark:text-zinc-400">{subtitle}</p>}
    </Reveal>
  );
}
