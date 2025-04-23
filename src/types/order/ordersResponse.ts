import { MetaData } from "../metadata";
import { Order } from "./order";

export interface OrdersResponse {
    status: string;
    message: string;
    data: {
        data: Order[];
        meta: MetaData;
    };
}