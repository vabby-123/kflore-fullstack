import { categories, productsByCategory } from "@/data/products";
import { PetalMotif } from "@/components/PetalMotif";

const FEATURED = new Set(["hand-bouquets", "wedding"]);

export function CollectionsGrid({ onSelect }: { onSelect: (slug: string) => void }) {
  return (
    <section id="collections" className="bg-[hsl(var(--k-bg-alt))] py-24 md:py-32">
      <div className="k-container">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-[hsl(var(--k-brand))]">Explore</p>
            <h2 className="mt-3 font-display text-4xl font-light md:text-5xl">Our collections</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Eight ways to say something you can&rsquo;t quite put into words — from a first bouquet to a
            grand-opening stand.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map((cat) => {
            const sample = productsByCategory(cat.slug)[0];
            const featured = FEATURED.has(cat.slug);
            return (
              <button
                key={cat.slug}
                onClick={() => onSelect(cat.slug)}
                className={`group relative flex flex-col justify-end overflow-hidden border k-hairline bg-[hsl(var(--k-surface))] p-5 text-left transition-all duration-500 hover:border-[hsl(var(--k-brand)/0.4)] ${
                  featured ? "col-span-2 aspect-[4/3] md:aspect-[16/11]" : "aspect-[4/5] md:aspect-[3/4]"
                }`}
              >
                {sample && (
                  <PetalMotif
                    palette={sample.palette}
                    variant={sample.variant}
                    className="absolute inset-0 h-full w-full scale-110 opacity-70 transition-transform duration-700 group-hover:scale-125"
                  />
                )}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(to top, hsl(var(--k-surface)) 8%, transparent 60%)" }}
                />
                <div className="relative">
                  <h3 className="font-display text-lg leading-tight md:text-xl">{cat.name}</h3>
                  <p className="mt-1 hidden text-xs text-muted-foreground md:block">{cat.blurb}</p>
                  <span className="eyebrow mt-3 inline-block text-[hsl(var(--k-brand))] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Shop now →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
