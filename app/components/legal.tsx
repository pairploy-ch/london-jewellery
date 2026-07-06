import type { LegalSection } from "./content";

/* renders a legal document (intro + numbered sections with optional bullets).
   No hooks, so it works in both Server pages and the client Terms modal. */
export function LegalBody({
  intro,
  sections,
}: {
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div>
      <p className="font-serif text-lg leading-relaxed text-ink-soft">{intro}</p>
      <ol className="mt-8 space-y-8">
        {sections.map((s, i) => (
          <li key={s.title}>
            <h3 className="font-display text-xl md:text-2xl">
              {i + 1}. {s.title}
            </h3>
            {s.body?.map((p, j) => (
              <p
                key={j}
                className="mt-3 font-serif text-base leading-relaxed text-ink-soft md:text-lg"
              >
                {p}
              </p>
            ))}
            {s.bullets ? (
              <ul className="mt-3 space-y-2">
                {s.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="flex gap-3 font-serif text-base leading-relaxed text-ink-soft md:text-lg"
                  >
                    <span className="mt-1 shrink-0 text-gold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
