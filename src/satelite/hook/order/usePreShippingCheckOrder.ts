"use server"

import { Order } from "@/types/order/order";
import axios from "axios";

export const preShippingCheckOrder = async (order: Order) => {
  const response = await axios.put(process.env.NEXT_PUBLIC_BASE_URL + `/orders/pre-shipping-check/${order.id}`, order);
  return response.data;
};