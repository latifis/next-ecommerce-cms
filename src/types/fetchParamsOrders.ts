import { OrderStatus } from "@/enum/orderStatus";
import { FetchParams } from "./fetchParams";
import { PaymentStatus } from "@/enum/paymentStatus";
import { PaymentMethod } from "@/enum/paymentMethod";

export interface FetchParamsOrders extends FetchParams {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
}