import { OrderStatus } from "@/enum/orderStatus";
import { FetchParams } from "./fetchParams";
import { PaymentStatus } from "@/enum/paymentStatus";
import { PaymentMethod } from "@/enum/paymentMethod";
import { OrderSource } from "@/enum/orderSource";

export interface FetchParamsOrders extends FetchParams {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    orderSource?: OrderSource;
}