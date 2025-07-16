import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const response = await api.post(
            `/user/register`,
            body
        );
        const token = response.data.token;

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
        console.error("Registration error:", err);
        if (err instanceof AxiosError) {
            return NextResponse.json(
                {
                    status: "error",
                    message: err.response?.data?.message || "Registration failed"
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