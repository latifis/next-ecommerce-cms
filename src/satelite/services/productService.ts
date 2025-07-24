import { FetchParams } from "@/types/fetchParams";
import { fetchProducts } from "../hook/product/useProducts";
import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { addProduct } from "../hook/product/useAddProduct";
import { updateProduct } from "../hook/product/useUpdateProduct";
import { fetchProductById } from "../hook/product/useProductById";
import { ProductByIdResponse } from "@/types/product/productByIdResponse";
import { fetchProductByCode } from "../hook/product/useProductByCode";
import { ProductsResponse } from "@/types/product/productsResponse";

export const useProducts = (params: FetchParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, params] = queryKey as [string, FetchParams];
      return fetchProducts(params);
    },
  });
};

export const useAllProducts = (params: FetchParams) => {
  return useInfiniteQuery<ProductsResponse, Error>({
    queryKey: ['products', params],
    queryFn: ({ pageParam = 1 }: QueryFunctionContext) => {
      const updatedParams = { ...params, page: pageParam as number, limit: params.limit ?? 10 };
      return fetchProducts(updatedParams);
    },
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage.data;
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
    initialPageParam: 1,
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