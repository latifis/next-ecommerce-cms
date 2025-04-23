import { TopPaymentMethods } from "./topPaymentMethods";

export interface TopPaymentMethodsResponse {
    status: string;
    message: string;
    data: {
        topPaymentMethods: TopPaymentMethods[];
    };
}