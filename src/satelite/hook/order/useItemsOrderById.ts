"use server"

import { ItemsOrderByIdResponse } from "@/types/order/itemsOrderByIdResponse";
import axios from "axios";

export const fetchItemsOrderById = async (orderId: string | undefined): Promise<ItemsOrderByIdResponse> => {
    const response = await axios.get<ItemsOrderByIdResponse>(process.env.NEXT_PUBLIC_BASE_URL + `/orders/items/${orderId}`);
    return response.data;
};