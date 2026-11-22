import "dotenv/config";
import { db } from "./client";

const categories = [
  { slug: "hand-bouquets", name: "Hand Bouquets", blurb: "Freshly gathered, hand-tied the day you order." },
  { slug: "flower-boxes", name: "Flower Boxes", blurb: "Structured arrangements that travel and last." },
  { slug: "graduation", name: "Graduation", blurb: "For the walk across the stage." },
  { slug: "birthday", name: "Birthday", blurb: "Bright, generous, unmistakably celebratory." },
  { slug: "anniversary", name: "Anniversary", blurb: "Deep, romantic tones for milestones shared." },
  { slug: "sympathy", name: "Sympathy", blurb: "Quiet, dignified arrangements for condolence." },
  { slug: "wedding", name: "Wedding", blurb: "Bridal work, arch florals and reception styling." },
  { slug: "grand-opening", name: "Grand Opening", blurb: "Stands and garlands that make an entrance." },
];

// Mirrors the storefront's src/data/products.ts so the API and the
// bundled frontend demo agree. Keep the two in sync if you edit either.
const products = [
  { id: "hb-01", name: "Burgundy Silk", category: "hand-bouquets", price: 218, compareAt: null, size: "18 stems",
    description: "Velvet garden roses in deep burgundy, hand-tied with trailing eucalyptus and a raw silk ribbon.",
    details: ["Garden roses, ranunculus, eucalyptus", "Wrapped in kraft & silk ribbon", "Free care card included"],
    palette: ["#5A1725", "#7A2234", "#B89A62"], variant: 0, bestseller: true, isNew: false },
  { id: "hb-02", name: "Champagne Hush", category: "hand-bouquets", price: 188, compareAt: null, size: "14 stems",
    description: "Champagne roses and blush spray roses, softened with dusty miller and lace fern.",
    details: ["Champagne & blush roses", "Dusty miller, lace fern", "Water tube for freshness"],
    palette: ["#B89A62", "#E7D9BD", "#B98282"], variant: 1, bestseller: false, isNew: false },
  { id: "hb-03", name: "Rustic Ivory", category: "hand-bouquets", price: 168, compareAt: null, size: "12 stems",
    description: "Ivory ranunculus and cotton bolls, gathered loosely for an undone, editorial feel.",
    details: ["Ivory ranunculus, cotton", "Olive foliage", "Hand-tied, no box"],
    palette: ["#F5F0E8", "#8B7A6D", "#B89A62"], variant: 2, bestseller: false, isNew: false },
  { id: "fb-01", name: "Noir Rose Box", category: "flower-boxes", price: 268, compareAt: 298, size: "Round box, 25cm",
    description: "Two dozen deep burgundy roses domed into a matte black keepsake box.",
    details: ["24 premium roses", "Matte black round box", "Same-day delivery eligible"],
    palette: ["#5A1725", "#151313", "#8B7A6D"], variant: 3, bestseller: true, isNew: false },
  { id: "fb-02", name: "Garden in a Box", category: "flower-boxes", price: 238, compareAt: null, size: "Square box, 20cm",
    description: "A mixed garden of peonies, roses and astilbe arranged flat in a signature ivory box.",
    details: ["Peonies, roses, astilbe", "Signature KFLORÉ box", "Ribbon & care card"],
    palette: ["#B98282", "#B89A62", "#F5F0E8"], variant: 4, bestseller: false, isNew: false },
  { id: "gr-01", name: "Dean's List", category: "graduation", price: 158, compareAt: null, size: "Cone bouquet",
    description: "A structured cone of sunflowers and gold-dipped eucalyptus for the stage walk.",
    details: ["Sunflowers, chrysanthemum", "Gold-dipped eucalyptus", "Rigid cone wrap, easy to carry"],
    palette: ["#B89A62", "#5A1725", "#F5F0E8"], variant: 0, bestseller: false, isNew: false },
  { id: "gr-02", name: "Scholar's Bloom", category: "graduation", price: 178, compareAt: null, size: "Money-flower option",
    description: "Roses and lisianthus with an optional folded-note money wrap for the graduate.",
    details: ["Roses, lisianthus", "Optional money-fold add-on", "Congrats tag included"],
    palette: ["#B98282", "#8B7A6D", "#B89A62"], variant: 1, bestseller: false, isNew: true },
  { id: "bd-01", name: "Citrus Bloom", category: "birthday", price: 148, compareAt: null, size: "16 stems",
    description: "Marigold, orange ranunculus and cream stock, tied bright for a birthday table.",
    details: ["Marigold, ranunculus, stock", "Balloon add-on available", "Same-day within KL"],
    palette: ["#B89A62", "#B98282", "#F5F0E8"], variant: 2, bestseller: true, isNew: false },
  { id: "bd-02", name: "Pink Confetti", category: "birthday", price: 168, compareAt: null, size: "18 stems",
    description: "Layers of pink peonies, spray roses and lisianthus in a playful, full silhouette.",
    details: ["Peonies, spray roses, lisianthus", "Wrapped in blush tissue", "Add a KFLORÉ card, free"],
    palette: ["#B98282", "#5A1725", "#F5F0E8"], variant: 3, bestseller: false, isNew: false },
  { id: "an-01", name: "Velvet Vow", category: "anniversary", price: 328, compareAt: 368, size: "36 stems",
    description: "Three dozen deep-red garden roses, densely packed for a serious occasion.",
    details: ["36 garden roses", "Hand-tied, tall wrap", "Complimentary chocolate add-on"],
    palette: ["#5A1725", "#151313", "#B89A62"], variant: 4, bestseller: true, isNew: false },
  { id: "an-02", name: "Ten Years", category: "anniversary", price: 258, compareAt: null, size: "24 stems",
    description: "Burgundy and mauve roses with trailing amaranthus, for milestones that took time.",
    details: ["Burgundy & mauve roses", "Trailing amaranthus", "Vase available on request"],
    palette: ["#7A2234", "#B98282", "#8B7A6D"], variant: 0, bestseller: false, isNew: false },
  { id: "sy-01", name: "White Peace Standing Wreath", category: "sympathy", price: 488, compareAt: null, size: "Standing, 150cm",
    description: "White lilies, chrysanthemum and orchids on a standing easel, with a printed ribbon banner.",
    details: ["Lilies, chrysanthemum, orchids", "Custom ribbon text", "Delivery to funeral parlour or home"],
    palette: ["#F5F0E8", "#8B7A6D", "#151313"], variant: 1, bestseller: false, isNew: false },
  { id: "sy-02", name: "Quiet Comfort", category: "sympathy", price: 198, compareAt: null, size: "Hand bouquet",
    description: "White roses and eucalyptus, arranged with restraint for condolence visits.",
    details: ["White roses, eucalyptus", "Plain kraft wrap", "Condolence card included"],
    palette: ["#F5F0E8", "#8B7A6D", "#B98282"], variant: 2, bestseller: false, isNew: false },
  { id: "wd-01", name: "Bridal Cascade", category: "wedding", price: 388, compareAt: null, size: "Bridal bouquet",
    description: "Ivory garden roses and trailing jasmine vine for the walk down the aisle.",
    details: ["Garden roses, jasmine vine", "Ribbon-wrapped stem handle", "Consultation required"],
    palette: ["#F5F0E8", "#B89A62", "#B98282"], variant: 3, bestseller: true, isNew: false },
  { id: "wd-02", name: "Reception Centrepiece", category: "wedding", price: 228, compareAt: null, size: "Per table, low arrangement",
    description: "Low, wide arrangements in blush and ivory for long reception tables.",
    details: ["Priced per table setting", "Minimum 6 tables", "Setup & collection available"],
    palette: ["#B98282", "#F5F0E8", "#8B7A6D"], variant: 4, bestseller: false, isNew: false },
  { id: "go-01", name: "Prosperity Stand", category: "grand-opening", price: 688, compareAt: null, size: "Standing, 180cm",
    description: "A tall congratulatory stand in red and gold blooms, banner text included.",
    details: ["Roses, gladioli, gold accents", "Custom banner text", "Delivery & setup included"],
    palette: ["#5A1725", "#B89A62", "#7A2234"], variant: 0, bestseller: true, isNew: false },
  { id: "go-02", name: "Garland of Honour", category: "grand-opening", price: 158, compareAt: null, size: "Sash garland",
    description: "A traditional sash garland in gold and burgundy for ribbon-cutting ceremonies.",
    details: ["Silk & fresh floral mix", "Reusable sash", "Same-day delivery eligible"],
    palette: ["#B89A62", "#5A1725", "#F5F0E8"], variant: 1, bestseller: false, isNew: true },
];

function seed() {
  const insertCategory = db.prepare(
    `INSERT INTO categories (slug, name, blurb) VALUES (@slug, @name, @blurb)
     ON CONFLICT(slug) DO UPDATE SET name = excluded.name, blurb = excluded.blurb`
  );
  const insertProduct = db.prepare(
    `INSERT INTO products (id, name, category, price, compare_at, size, description, details, palette, variant, bestseller, is_new, active)
     VALUES (@id, @name, @category, @price, @compareAt, @size, @description, @details, @palette, @variant, @bestseller, @isNew, 1)
     ON CONFLICT(id) DO UPDATE SET
       name=excluded.name, category=excluded.category, price=excluded.price, compare_at=excluded.compare_at,
       size=excluded.size, description=excluded.description, details=excluded.details, palette=excluded.palette,
       variant=excluded.variant, bestseller=excluded.bestseller, is_new=excluded.is_new`
  );

  const run = db.transaction(() => {
    for (const c of categories) insertCategory.run(c);
    for (const p of products) {
      insertProduct.run({
        ...p,
        compareAt: p.compareAt ?? null,
        details: JSON.stringify(p.details),
        palette: JSON.stringify(p.palette),
        bestseller: p.bestseller ? 1 : 0,
        isNew: p.isNew ? 1 : 0,
      });
    }
  });
  run();

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

seed();
