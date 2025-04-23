"use server"

import { Payment } from "@/types/order/payment";
import axios from "axios";

export const verifyPayment = async (payment: Payment) => {
  const response = await axios.put(process.env.NEXT_PUBLIC_BASE_URL + `/payments/verify-payment/${payment.id}`, payment);
  return response.data;
};