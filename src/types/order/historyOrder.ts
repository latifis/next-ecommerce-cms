import { OrderStatus } from "@/enum/orderStatus";

export interface HistoryOrder {
    id: string;
    orderId: string;
    status: OrderStatus;
    changedAt: string;
}