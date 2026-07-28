export function KeyBenefits({ benefits }: { benefits: string[] }) {
  if (benefits.length === 0) return null;

  return (
    <div className="rounded-r-2xl border-l-4 border-rose-300 bg-rose-50 px-4 py-4 dark:border-rose-800 dark:bg-rose-950/40">
      <ul className="flex flex-col gap-2.5">
        {benefits.map((benefit) => (
          <li
            key={benefit}
            className="flex items-center gap-2.5 text-sm font-semibold text-rose-950 dark:text-rose-50"
          >
            <span aria-hidden>👍</span>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
}
