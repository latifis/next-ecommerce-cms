import { User } from "../user/user";
import { HistoryOrder } from "./historyOrder";
import { Order } from "./order";
import { OrderItem } from "./orderItem";
import { Payment } from "./payment";

export interface OrderByIdResponse {
    status: string;
    message: string;
    data: {
        order: Order,
        user: User,
        items: OrderItem[],
        payment: Payment,
        histories: HistoryOrder[]
    }
}
