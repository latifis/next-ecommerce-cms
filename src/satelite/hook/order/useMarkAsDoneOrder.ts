"use server"

import { Order } from "@/types/order/order";
import axios from "axios";

export const markAsDoneOrder = async (order: Order) => {
  const response = await axios.put(process.env.NEXT_PUBLIC_BASE_URL + `/orders/mark-as-done/${order.id}`, order);
  return response.data;
};