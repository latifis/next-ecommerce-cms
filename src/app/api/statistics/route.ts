import { api } from "@/lib/axios";
import { StatisticsResponse } from "@/types/statistics/statisticsResponse";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await api.get<StatisticsResponse>(
            `/statistics`,
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
        console.error("Error fetching statistics:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}