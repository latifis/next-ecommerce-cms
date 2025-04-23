import { FetchParams } from "@/types/fetchParams";
import { fetchCategories } from "../hook/category/useCategories";
import { QueryFunctionContext, useMutation, useQuery } from "@tanstack/react-query";
import { Category } from "@/types/category/category";
import { addCategory } from "../hook/category/useAddCategory";
import { updateCategory } from "../hook/category/useUpdateCategory";
import { fetchCategoryById } from "../hook/category/useCategoryById";
import { CategoryByIdResponse } from "@/types/category/categoryByIdResponse";

export const useCategories = (params: FetchParams) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, params] = queryKey as [string, FetchParams];
      return fetchCategories(params);
    },
  });
};

export const useCategoryById = (categoryId: string | undefined) => {
  return useQuery<CategoryByIdResponse, Error>({
    queryKey: ['category', categoryId],
    queryFn: () => fetchCategoryById(categoryId),
    enabled: !!categoryId,
  });
};

export const useAddCategory = () => {
  return useMutation({
    mutationFn: (category: Category) => addCategory(category)
  });
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: (category: Category) => updateCategory(category)
  });
};