import { Truck, Clock, MapPin, Wallet } from "lucide-react";

const TILES = [
  {
    icon: Truck,
    title: "Same-day delivery",
    body: "Order before our daily cut-off and we'll deliver within Kuala Lumpur & Selangor the same day.",
  },
  {
    icon: Clock,
    title: "Cut-off times",
    body: "12pm for same-day delivery. Orders placed after 12pm are scheduled for the next available slot.",
  },
  {
    icon: MapPin,
    title: "Delivery zones",
    body: "All of Kuala Lumpur and Selangor. Outstation and self-collection from our Bangsar studio also available.",
  },
  {
    icon: Wallet,
    title: "Delivery charges",
    body: "From RM15 within 10km of Bangsar; further zones quoted on WhatsApp before you confirm.",
  },
];

export function DeliverySection() {
  return (
    <section id="delivery" className="bg-[hsl(var(--k-bg-alt))] py-24 md:py-32">
      <div className="k-container">
        <div className="mb-14 max-w-lg">
          <p className="eyebrow text-[hsl(var(--k-brand))]">Good to know</p>
          <h2 className="mt-3 font-display text-4xl font-light md:text-5xl">Delivery &amp; care</h2>
        </div>

        <div className="grid gap-px overflow-hidden border k-hairline sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-[hsl(var(--k-surface))] p-7">
              <Icon className="h-5 w-5 text-[hsl(var(--k-brand))]" strokeWidth={1.25} />
              <h3 className="mt-4 font-display text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
