import { OrdersResponse } from "@/types/order/ordersResponse";
import { FetchParamsOrders } from "@/types/fetchParamsOrders";
import { apiClient } from "@/lib/client/axios-client";
import { buildQueryString } from "@/utils/buildQueryString";

export const fetchOrders = async (params: FetchParamsOrders): Promise<OrdersResponse> => {
    try {
        const queryString = buildQueryString(params || {});
        const response = await apiClient.get<OrdersResponse>(
            `/orders?${queryString}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
