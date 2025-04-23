import { ItemsOrder } from "./itemsOrder";

export interface ItemsOrderByIdResponse {
    status: string;
    message: string;
    data: {
        items: ItemsOrder[];
    }
}
