import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = new URLSearchParams(searchParams).toString();

    try {
        const response = await api.get(`/product?${query}`);

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const form = await req.formData();

        const formData = new FormData();
        for (const [key, value] of form.entries()) {
            formData.append(key, value);
        }

        const response = await api.post(`/product`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return NextResponse.json(response.data, {
            status: response.status,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        if (error instanceof AxiosError) {
            return NextResponse.json(
                { message: error.response?.data.message || "Internal Server Error" },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

