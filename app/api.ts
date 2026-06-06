import type { CartItem } from "@/types";

/**
 * Create a new order in the backend API.  Sends a POST request to
 * `/api/orders` with the current cart items, customer details and
 * payment method.  The backend is expected to generate an order ID
 * and return the created order.  Errors are thrown when the
 * request fails.
 */
interface CreateOrderPayload {
  /** Optional Firebase user ID; undefined when not authenticated */
  uid?: string;
  /** Items in the order */
  items: CartItem[];
  /** Total amount for the order */
  totalAmount: number;
  /** Total count of items in the order */
  totalCount: number;
  /** Customer name */
  name: string;
  /** Customer phone number */
  phone: string;
  /** Optional customer comment */
  comment?: string;
  /** Payment method chosen */
  paymentMethod: "card" | "cash";
}

export async function createOrder(payload: CreateOrderPayload) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error("Failed to create order");
  }
  return res.json();
}

/**
 * Fetch orders for a specific user.  Retrieves a list of orders
 * filtered by the Firebase uid.  When the uid is undefined the
 * request is not made and an empty array is returned instead.
 */
export async function getOrders(uid?: string) {
  if (!uid) return [];
  const res = await fetch(`/api/orders?uid=${uid}`);
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return res.json();
}