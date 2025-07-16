import { apiClient } from "@/lib/client/axios-client";
import { ItemsOrderByIdResponse } from "@/types/order/itemsOrderByIdResponse";

export const fetchItemsOrderById = async (orderId: string | undefined): Promise<ItemsOrderByIdResponse> => {
    const response = await apiClient.get<ItemsOrderByIdResponse>(
        `/orders/items/${orderId}`
    );
    return response.data;
};