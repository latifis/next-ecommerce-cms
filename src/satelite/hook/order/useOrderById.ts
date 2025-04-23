"use server"

import { OrderByIdResponse } from "@/types/order/orderByIdResponse";
import axios from "axios";

export const fetchOrderById = async (orderId: string | undefined): Promise<OrderByIdResponse> => {
    const response = await axios.get<OrderByIdResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/orders/${orderId}`);
    return response.data;
};