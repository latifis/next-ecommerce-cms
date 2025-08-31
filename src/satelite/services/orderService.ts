import { FetchParams } from "@/types/fetchParams";
import { fetchOrders } from "../hook/order/useOrders";
import { QueryFunctionContext, useMutation, useQuery } from "@tanstack/react-query";
import { markAsDoneOrder } from "../hook/order/useMarkAsDoneOrder";
import { fetchOrderById } from "../hook/order/useOrderById";
import { OrderByIdResponse } from "@/types/order/orderByIdResponse";
import { Payment } from "@/types/order/payment";
import { Order } from "@/types/order/order";
import { verifyPayment } from "../hook/order/useVerifyPayment";
import { ItemsOrderByIdResponse } from "@/types/order/itemsOrderByIdResponse";
import { fetchItemsOrderById } from "../hook/order/useItemsOrderById";
import { preShippingCheckOrder } from "../hook/order/usePreShippingCheckOrder";
import { CreateOrderInput } from "@/types/order/createOrderInput";
import { addOrder } from "../hook/order/useAddOrder";
import { rejectPayment } from "../hook/order/useRejectPayment";

export const useAddOrder = () => {
  return useMutation({
    mutationFn: (orderData: CreateOrderInput) => addOrder(orderData),
  });
};

export const useOrders = (params: FetchParams) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, params] = queryKey as [string, FetchParams];
      return fetchOrders(params);
    },
  });
};

export const useOrderById = (orderId: string | undefined) => {
  return useQuery<OrderByIdResponse, Error>({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useItemsOrderById = (orderId: string | undefined) => {
  return useQuery<ItemsOrderByIdResponse, Error>({
    queryKey: ['itemsOrder', orderId],
    queryFn: () => fetchItemsOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useMarkAsDoneOrder = () => {
  return useMutation({
    mutationFn: (order: Order) => markAsDoneOrder(order)
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (payment: Payment) => verifyPayment(payment)
  });
};

export const useRejectPayment = () => {
  return useMutation({
    mutationFn: (payment: Payment) => rejectPayment(payment)
  });
};

export const usePreShippingCheckOrder = () => {
  return useMutation({
    mutationFn: (order: Order) => preShippingCheckOrder(order)
  });
};