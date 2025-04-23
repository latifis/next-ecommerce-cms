import { OrderStatus } from "@/enum/orderStatus";
import { PaymentMethod } from "@/enum/paymentMethod";
import { PaymentStatus } from "@/enum/paymentStatus";

export interface Order {
    id?: string;
    userId?: string;
    orderId?: string;
    orderStatus: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    totalPrice?: string;
    createdAt?: string;
    updatedAt?: string;
    user?: {
        name?: string;
    }
}