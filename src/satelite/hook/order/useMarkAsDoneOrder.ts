import { apiClient } from "@/lib/client/axios-client";
import { Order } from "@/types/order/order";

export const markAsDoneOrder = async (order: Order) => {
  const response = await apiClient.put(
    `/orders/mark-as-done/${order.id}`,
    order
  );
  return response.data;
};