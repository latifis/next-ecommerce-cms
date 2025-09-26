import { FetchParams } from "@/types/fetchParams";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { fetchPayment } from "../hook/payment/usePayment";
import { fetchPaymentById } from "../hook/payment/usePaymentById";
import { updatePayment } from "../hook/payment/useUpdatePayment";
import { addPayment } from "../hook/payment/useAddPayment";

export const usePayment = (params: FetchParams) => {
    return useQuery({
        queryKey: ['payments', params],
        queryFn: ({ queryKey }) => {
            const [, params] = queryKey as [string, FetchParams];
            return fetchPayment(params);
        },
    })
}
export const usePaymentById = (paymentId: string | undefined) => {
    return useQuery({
        queryKey: ['payments', paymentId],
        queryFn: () => fetchPaymentById(paymentId),
        enabled: !!paymentId,
    });
}
export const useAddPayment = () => {
    return useMutation({
        mutationFn: (payment: FormData) => addPayment(payment)
    });
}
export const useUpdatePayment = (paymentId: string | undefined) => {
    return useMutation({
        mutationFn: (payment: FormData) => updatePayment(payment, paymentId)
    })
}

export const useUpdatePaymentRaw = () => {
    return useMutation({
        mutationFn: ({ paymentId, data }: { paymentId: string; data: FormData }) =>
            updatePayment(data, paymentId),
    });
};