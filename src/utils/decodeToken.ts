import { DecodedToken } from "@/types/decodedToken";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string | undefined): DecodedToken | null => {
    try {
        if (!token){
            return null;
        }
        const decoded: DecodedToken = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Token decoding failed", error);
        return null;
    }
};