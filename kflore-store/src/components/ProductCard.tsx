import type { Product } from "@/types";
import { PetalMotif } from "@/components/PetalMotif";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Plus } from "lucide-react";

function formatMYR(n: number) {
  return `RM${n.toFixed(0)}`;
}

export function ProductCard({ product, onView }: { product: Product; onView: (p: Product) => void }) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col">
      <button
        onClick={() => onView(product)}
        className="relative block aspect-[4/5] w-full overflow-hidden border k-hairline bg-[hsl(var(--k-surface))]"
      >
        <PetalMotif
          palette={product.palette}
          variant={product.variant}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        {(product.bestseller || product.isNew) && (
          <span className="eyebrow absolute left-3 top-3 bg-[hsl(var(--k-surface)/0.92)] px-2 py-1 text-[hsl(var(--k-brand))]">
            {product.bestseller ? "Bestseller" : "New"}
          </span>
        )}
        <Button
          size="sm"
          variant="secondary"
          className="absolute bottom-3 right-3 gap-1 rounded-none opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            addItem(product, 1);
            toast(`${product.name} added to cart`, { description: product.size });
          }}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Add
        </Button>
      </button>
      <button onClick={() => onView(product)} className="mt-3 text-left">
        <h3 className="font-display text-base leading-snug">{product.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{product.size}</p>
        <p className="mt-1.5 text-sm">
          {formatMYR(product.price)}
          {product.compareAt && (
            <span className="ml-2 text-xs text-muted-foreground line-through">{formatMYR(product.compareAt)}</span>
          )}
        </p>
      </button>
    </div>
  );
}
