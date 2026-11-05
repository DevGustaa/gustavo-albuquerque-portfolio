function MarqueeList({ items }: { items: string[] }) {
  return (
    <ul className="flex shrink-0 items-center gap-6 pr-6">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-6 font-mono text-sm whitespace-nowrap text-zinc-500 dark:text-zinc-400"
        >
          <span>{item}</span>
          <span className="text-accent-500">✦</span>
        </li>
      ))}
    </ul>
  );
}

export function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div
      aria-hidden="true"
      data-testid="marquee"
      className="relative overflow-hidden border-y border-zinc-200 py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] dark:border-zinc-800"
    >
      <div className="marquee-track flex w-max animate-marquee">
        <MarqueeList items={items} />
        <MarqueeList items={items} />
      </div>
    </div>
  );
}
