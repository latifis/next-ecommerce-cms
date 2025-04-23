"use server"

import { OrdersResponse } from "@/types/order/ordersResponse";
import axios from "axios";
import { FetchParamsOrders } from "@/types/fetchParamsOrders";

export const fetchOrders = async (params: FetchParamsOrders): Promise<OrdersResponse> => {
    const response = await axios.get<OrdersResponse>(process.env.NEXT_PUBLIC_BASE_URL + "/orders", { params });
    return response.data;
};
