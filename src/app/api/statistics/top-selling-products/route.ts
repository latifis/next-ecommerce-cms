import { api } from "@/lib/axios";
import { TopSellingProductsResponse } from "@/types/statistics/topSellingProductsResponse";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const query = new URLSearchParams(searchParams).toString();

    try {
        const response = await api.get<TopSellingProductsResponse>(
            `/statistics/top-selling-products?${query}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return NextResponse.json(response.data, {
            status: response.status,
        });
    } catch (error) {
        console.error("Error fetching top selling products:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}