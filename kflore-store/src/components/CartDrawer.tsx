import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { PetalMotif } from "@/components/PetalMotif";
import { Minus, Plus, X, CheckCircle2, MessageCircle } from "lucide-react";
import type { DeliveryDetails } from "@/types";
import { buildOrderMessage, buildWhatsAppLink } from "@/lib/whatsapp";

function formatMYR(n: number) {
  return `RM${n.toFixed(0)}`;
}

const TIME_SLOTS = ["9am – 12pm", "12pm – 3pm", "3pm – 6pm", "6pm – 9pm"];

const emptyDelivery: DeliveryDetails = {
  fullName: "",
  phone: "",
  address: "",
  date: "",
  timeSlot: TIME_SLOTS[0],
  cardMessage: "",
  recipientDifferent: false,
};

export function CartDrawer() {
  const { lines, isOpen, close, removeItem, setQty, subtotal, clear } = useCart();
  const [step, setStep] = useState<"cart" | "checkout" | "confirmed">("cart");
  const [delivery, setDelivery] = useState<DeliveryDetails>(emptyDelivery);
  const [orderId, setOrderId] = useState("");
  const [waLink, setWaLink] = useState("");

  const reset = () => {
    setStep("cart");
    setDelivery(emptyDelivery);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
      if (step === "confirmed") reset();
    }
  };

  const canSubmit = delivery.fullName.trim() && delivery.phone.trim() && delivery.address.trim() && delivery.date;

  const submitOrder = () => {
    const id = `KF-${Date.now().toString().slice(-6)}`;
    const message = buildOrderMessage(lines, delivery, id);
    const link = buildWhatsAppLink(message);
    setOrderId(id);
    setWaLink(link);
    setStep("confirmed");
    window.open(link, "_blank", "noreferrer");
    clear();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 rounded-none border-l k-hairline bg-background p-0 sm:max-w-md">
        <SheetTitle className="sr-only">
          {step === "cart" ? "Your cart" : step === "checkout" ? "Checkout" : "Order confirmed"}
        </SheetTitle>

        {step === "cart" && (
          <>
            <div className="flex items-center justify-between border-b k-hairline px-6 py-5">
              <h2 className="font-display text-xl">Your cart</h2>
              <span className="text-xs text-muted-foreground">{lines.length} item{lines.length === 1 ? "" : "s"}</span>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                  <p className="font-display text-lg">Your cart is empty</p>
                  <p className="text-sm">Add a bouquet, box or stand to begin.</p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {lines.map((l) => (
                    <li key={l.product.id} className="flex gap-3">
                      <div className="h-20 w-20 shrink-0 overflow-hidden border k-hairline bg-[hsl(var(--k-bg-alt))]">
                        <PetalMotif palette={l.product.palette} variant={l.product.variant} className="h-full w-full" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-sm leading-tight">{l.product.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{l.product.size}</p>
                          </div>
                          <button
                            onClick={() => removeItem(l.product.id)}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label={`Remove ${l.product.name}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center border k-hairline">
                            <button
                              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                              onClick={() => setQty(l.product.id, l.qty - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs tabular-nums">{l.qty}</span>
                            <button
                              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                              onClick={() => setQty(l.product.id, l.qty + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm tabular-nums">{formatMYR(l.product.price * l.qty)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t k-hairline px-6 py-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">{formatMYR(subtotal)}</span>
                </div>
                <Button
                  className="w-full rounded-none bg-[hsl(var(--k-brand))] text-[hsl(var(--k-on-brand))] hover:bg-[hsl(var(--k-brand-strong))]"
                  onClick={() => setStep("checkout")}
                >
                  Checkout
                </Button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Delivery charges are calculated with our florist on WhatsApp.
                </p>
              </div>
            )}
          </>
        )}

        {step === "checkout" && (
          <>
            <div className="flex items-center gap-3 border-b k-hairline px-6 py-5">
              <button onClick={() => setStep("cart")} className="text-sm text-muted-foreground hover:text-foreground">
                ← Back
              </button>
              <h2 className="font-display text-xl">Delivery details</h2>
            </div>

            <form
              className="flex-1 space-y-4 overflow-y-auto px-6 py-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (canSubmit) submitOrder();
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs">Your name</Label>
                <Input
                  id="fullName"
                  required
                  className="rounded-none"
                  value={delivery.fullName}
                  onChange={(e) => setDelivery((d) => ({ ...d, fullName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs">Phone number</Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  placeholder="012-345 6789"
                  className="rounded-none"
                  value={delivery.phone}
                  onChange={(e) => setDelivery((d) => ({ ...d, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs">Delivery address (KL / Selangor)</Label>
                <Textarea
                  id="address"
                  required
                  rows={2}
                  className="rounded-none"
                  value={delivery.address}
                  onChange={(e) => setDelivery((d) => ({ ...d, address: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="date" className="text-xs">Delivery date</Label>
                  <Input
                    id="date"
                    required
                    type="date"
                    className="rounded-none"
                    value={delivery.date}
                    onChange={(e) => setDelivery((d) => ({ ...d, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="timeSlot" className="text-xs">Time slot</Label>
                  <select
                    id="timeSlot"
                    className="h-10 w-full border border-input bg-background px-3 text-sm"
                    value={delivery.timeSlot}
                    onChange={(e) => setDelivery((d) => ({ ...d, timeSlot: e.target.value }))}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cardMessage" className="text-xs">Message card (optional)</Label>
                <Textarea
                  id="cardMessage"
                  rows={2}
                  placeholder="Happy anniversary, my love."
                  className="rounded-none"
                  value={delivery.cardMessage}
                  onChange={(e) => setDelivery((d) => ({ ...d, cardMessage: e.target.value }))}
                />
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={delivery.recipientDifferent}
                  onChange={(e) => setDelivery((d) => ({ ...d, recipientDifferent: e.target.checked }))}
                />
                Sending to someone else — add their contact
              </label>

              {delivery.recipientDifferent && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="recipientName" className="text-xs">Recipient name</Label>
                    <Input
                      id="recipientName"
                      className="rounded-none"
                      value={delivery.recipientName || ""}
                      onChange={(e) => setDelivery((d) => ({ ...d, recipientName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="recipientPhone" className="text-xs">Recipient phone</Label>
                    <Input
                      id="recipientPhone"
                      className="rounded-none"
                      value={delivery.recipientPhone || ""}
                      onChange={(e) => setDelivery((d) => ({ ...d, recipientPhone: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </form>

            <div className="border-t k-hairline px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{formatMYR(subtotal)}</span>
              </div>
              <Button
                disabled={!canSubmit}
                className="w-full gap-2 rounded-none bg-[hsl(var(--k-brand))] text-[hsl(var(--k-on-brand))] hover:bg-[hsl(var(--k-brand-strong))] disabled:opacity-40"
                onClick={submitOrder}
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                Confirm &amp; order via WhatsApp
              </Button>
            </div>
          </>
        )}

        {step === "confirmed" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-[hsl(var(--k-brand))]" strokeWidth={1.25} />
            <h2 className="font-display text-2xl">Order sent</h2>
            <p className="text-sm text-muted-foreground">
              Reference <span className="tabular-nums text-foreground">{orderId}</span>. We opened WhatsApp with
              your order — send the message and our florist will confirm availability and delivery charges.
            </p>
            <a href={waLink} target="_blank" rel="noreferrer" className="eyebrow text-[hsl(var(--k-brand))] underline underline-offset-4">
              Didn&rsquo;t open? Tap here
            </a>
            <Button variant="outline" className="mt-2 rounded-none" onClick={() => handleOpenChange(false)}>
              Continue shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
