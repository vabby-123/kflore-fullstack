import { useMemo, useState } from "react";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import type { Product } from "@/types";

export function ShopSection({ activeCategory, onCategoryChange }: { activeCategory: string | null; onCategoryChange: (slug: string | null) => void }) {
  const [viewing, setViewing] = useState<Product | null>(null);

  const visible = useMemo(
    () => (activeCategory ? products.filter((p) => p.category === activeCategory) : products),
    [activeCategory]
  );

  return (
    <section id="shop" className="k-container py-24 md:py-32">
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-[hsl(var(--k-brand))]">The shop</p>
          <h2 className="mt-3 font-display text-4xl font-light md:text-5xl">
            {activeCategory ? categories.find((c) => c.slug === activeCategory)?.name : "Every arrangement"}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`eyebrow border px-3.5 py-2 transition-colors ${
              !activeCategory
                ? "border-[hsl(var(--k-brand))] bg-[hsl(var(--k-brand))] text-[hsl(var(--k-on-brand))]"
                : "border-[hsl(var(--k-line)/0.16)] text-muted-foreground hover:border-[hsl(var(--k-brand)/0.4)]"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => onCategoryChange(c.slug)}
              className={`eyebrow border px-3.5 py-2 transition-colors ${
                activeCategory === c.slug
                  ? "border-[hsl(var(--k-brand))] bg-[hsl(var(--k-brand))] text-[hsl(var(--k-on-brand))]"
                  : "border-[hsl(var(--k-line)/0.16)] text-muted-foreground hover:border-[hsl(var(--k-brand)/0.4)]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} onView={setViewing} />
        ))}
      </div>

      <ProductDialog product={viewing} onOpenChange={(open) => !open && setViewing(null)} />
    </section>
  );
}
