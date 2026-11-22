import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Product } from "@/types";
import { PetalMotif } from "@/components/PetalMotif";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

function formatMYR(n: number) {
  return `RM${n.toFixed(0)}`;
}

export function ProductDialog({ product, onOpenChange }: { product: Product | null; onOpenChange: (open: boolean) => void }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <Dialog
      open={!!product}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setQty(1);
      }}
    >
      <DialogContent className="max-w-3xl gap-0 overflow-hidden rounded-none border-none p-0 sm:rounded-none">
        <DialogTitle className="sr-only">{product?.name ?? "Product"}</DialogTitle>
        {product && (
          <div className="grid md:grid-cols-2">
            <div className="aspect-square bg-[hsl(var(--k-bg-alt))] md:aspect-auto">
              <PetalMotif palette={product.palette} variant={product.variant} className="h-full w-full" />
            </div>
            <div className="flex flex-col p-6 md:p-9">
              <p className="eyebrow text-[hsl(var(--k-brand))]">{product.size}</p>
              <h2 className="mt-2 font-display text-2xl md:text-3xl">{product.name}</h2>
              <p className="mt-1.5 text-lg">
                {formatMYR(product.price)}
                {product.compareAt && (
                  <span className="ml-2 text-sm text-muted-foreground line-through">{formatMYR(product.compareAt)}</span>
                )}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[hsl(var(--k-brand))]" />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center gap-4 pt-8">
                <div className="flex items-center border k-hairline">
                  <button
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                  <button
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Button
                  className="flex-1 rounded-none bg-[hsl(var(--k-brand))] text-[hsl(var(--k-on-brand))] hover:bg-[hsl(var(--k-brand-strong))]"
                  onClick={() => {
                    addItem(product, qty);
                    toast(`${product.name} added to cart`, { description: `${qty} × ${product.size}` });
                    onOpenChange(false);
                    setQty(1);
                  }}
                >
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
