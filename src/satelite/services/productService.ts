import { FetchParams } from "@/types/fetchParams";
import { fetchProducts } from "../hook/product/useProducts";
import { QueryFunctionContext, useMutation, useQuery } from "@tanstack/react-query";
import { addProduct } from "../hook/product/useAddProduct";
import { updateProduct } from "../hook/product/useUpdateProduct";
import { fetchProductById } from "../hook/product/useProductById";
import { ProductByIdResponse } from "@/types/product/productByIdResponse";

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