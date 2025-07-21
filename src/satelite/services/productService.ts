import { FetchParams } from "@/types/fetchParams";
import { fetchProducts } from "../hook/product/useProducts";
import { QueryFunctionContext, useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { addProduct } from "../hook/product/useAddProduct";
import { updateProduct } from "../hook/product/useUpdateProduct";
import { fetchProductById } from "../hook/product/useProductById";
import { ProductByIdResponse } from "@/types/product/productByIdResponse";
import { fetchProductByCode } from "../hook/product/useProductByCode";

export const useProducts = (params: FetchParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, params] = queryKey as [string, FetchParams];
      return fetchProducts(params);
    },
  });
};

export const useProductById = (productId: string | undefined) => {
  return useQuery<ProductByIdResponse, Error>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });
};

export const useProductByCode = (
  code: string | null | undefined
): UseQueryResult<ProductByIdResponse, Error> => {
  return useQuery({
    queryKey: ['product-by-code', code],
    queryFn: async () => {
      if (!code) throw new Error('No code provided');
      return await fetchProductByCode(code);
    },
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useAddProduct = () => {
  return useMutation({
    mutationFn: (product: FormData) => addProduct(product)
  });
};

export const useUpdateProduct = (productId: string | undefined) => {
  return useMutation({
    mutationFn: (product: FormData) => updateProduct(product, productId)
  });
};