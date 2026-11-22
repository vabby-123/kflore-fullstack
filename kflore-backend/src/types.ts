export interface Category {
  slug: string;
  name: string;
  blurb: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAt: number | null;
  size: string;
  description: string;
  details: string[];
  palette: [string, string, string];
  variant: number;
  bestseller: boolean;
  isNew: boolean;
  active: boolean;
}

export interface OrderItemInput {
  productId: string;
  qty: number;
  note?: string;
}

export interface OrderInput {
  items: OrderItemInput[];
  fullName: string;
  phone: string;
  address: string;
  date: string;
  timeSlot: string;
  cardMessage?: string;
  recipientDifferent?: boolean;
  recipientName?: string;
  recipientPhone?: string;
}

export type OrderStatus = "new" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: OrderStatus;
  fullName: string;
  phone: string;
  address: string;
  date: string;
  timeSlot: string;
  cardMessage: string | null;
  recipientDifferent: boolean;
  recipientName: string | null;
  recipientPhone: string | null;
  subtotal: number;
  items: (OrderItemInput & { name: string; price: number })[];
}
