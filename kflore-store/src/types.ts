export type CategorySlug =
  | "hand-bouquets"
  | "flower-boxes"
  | "graduation"
  | "birthday"
  | "anniversary"
  | "sympathy"
  | "wedding"
  | "grand-opening";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
}

export type PetalVariant = 0 | 1 | 2 | 3 | 4 | 5;

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  size: string;
  description: string;
  details: string[];
  palette: [string, string, string];
  variant: PetalVariant;
  bestseller?: boolean;
  isNew?: boolean;
}

export interface CartLine {
  product: Product;
  qty: number;
  note?: string;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  address: string;
  date: string;
  timeSlot: string;
  cardMessage: string;
  recipientDifferent: boolean;
  recipientName?: string;
  recipientPhone?: string;
}
