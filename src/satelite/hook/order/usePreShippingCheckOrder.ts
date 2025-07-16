import { apiClient } from "@/lib/client/axios-client";
import { Order } from "@/types/order/order";

export const preShippingCheckOrder = async (order: Order) => {
  const response = await apiClient.put(
    `/orders/pre-shipping-check/${order.id}`,
    order
  );
  return response.data;
};