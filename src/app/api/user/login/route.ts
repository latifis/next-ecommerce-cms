import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { serialize } from "cookie";
import { verifyToken } from "@/lib/auth";
import { DecodedToken } from "@/types/decodedToken";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const response = await api.post(
            `/user/login`,
            body
        );
        const token = response.data.token;
        const payload = await verifyToken(token) as DecodedToken | null;

        if (!payload || payload.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json(
                { status: "error", message: "Invalid token" },
                { status: 401 }
            );
        }

        const res = NextResponse.json(
            { status: "success", data: response.data },
            { status: 200 }
        );

        res.headers.set('Set-Cookie',
            serialize('token', token, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            })
        );

        return res;
    } catch (err: unknown) {
        console.error("Login error:", err);
        if (err instanceof AxiosError) {
            return NextResponse.json(
                {
                    status: "error",
                    message: err.response?.data?.message || "Login failed"
                },
                { status: err.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { status: "error", message: "Unexpected error" },
            { status: 500 }
        );
    }
}