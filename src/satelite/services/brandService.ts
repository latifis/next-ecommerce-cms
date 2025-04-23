import { FetchParams } from "@/types/fetchParams";
import { fetchBrands } from "../hook/brand/useBrands";
import { QueryFunctionContext, useMutation, useQuery } from "@tanstack/react-query";
import { addBrand } from "../hook/brand/useAddBrand";
import { updateBrand } from "../hook/brand/useUpdateBrand";
import { fetchBrandById } from "../hook/brand/useBrandById";
import { BrandByIdResponse } from "@/types/brand/brandByIdResponse";

export const useBrands = (params: FetchParams) => {
  return useQuery({
    queryKey: ['brands', params],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, params] = queryKey as [string, FetchParams];
      return fetchBrands(params);
    },
  });
};

export const useBrandById = (brandId: string | undefined) => {
  return useQuery<BrandByIdResponse, Error>({
    queryKey: ['brand', brandId],
    queryFn: () => fetchBrandById(brandId),
    enabled: !!brandId,
  });
};

export const useAddBrand = () => {
  return useMutation({
    mutationFn: (brand: FormData) => addBrand(brand)
  });
};

export const useUpdateBrand = (brandId: string | undefined) => {
  return useMutation({
    mutationFn: (brand: FormData) => updateBrand(brand, brandId)
  });
};