"use server"

import axios from "axios";

export const login = async (credentials: { email: string; password: string }) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/user/login`,
            credentials
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error("An unexpected error occurred.");
    }
};