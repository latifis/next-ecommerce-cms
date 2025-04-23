import { Product } from "../product/product";

export interface OrderItem {
    id: string;
    orderId: string;
    product: Product;
    quantity: number;
    subtotal: string;
    createdAt: string;
    updatedAt: string;
}