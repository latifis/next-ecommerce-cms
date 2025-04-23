import { FetchParams } from "@/types/fetchParams";
import { useQuery } from "@tanstack/react-query";
import { fetchBanner } from "../hook/banner/useBanner";
import { fetchBannerById } from "../hook/banner/useBannerById";
import { updateBanner } from "../hook/banner/useUpdateBanner";
import { useMutation } from "@tanstack/react-query";
import { addBanner } from "../hook/banner/useAddBanner";

export const useBanner = (params: FetchParams) => {
    return useQuery({
        queryKey: ['banners', params],
        queryFn: ({ queryKey }) => {
            const [, params] = queryKey as [string, FetchParams];
            return fetchBanner(params);
        },
    })
}
export const useBannerById = (bannerId: string | undefined) => {
    return useQuery({
        queryKey: ['banner', bannerId],
        queryFn: () => fetchBannerById(bannerId),
        enabled: !!bannerId,
    });
}
export const useAddBanner = () => {
    return useMutation({
        mutationFn: (banner: FormData) => addBanner(banner)
    });
}
export const useUpdateBanner = (bannerId: string | undefined) => {
    return useMutation({
        mutationFn: (banner: FormData) => updateBanner(banner, bannerId)
    })
}