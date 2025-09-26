import { Gender } from "@/enum/gender";
import { Language } from "@/enum/language";
import { UserRole } from "@/enum/userRole";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string;
    address: string;
    birthDate: string;
    gender: Gender;
    profileImageUrl: string;
    languagePreference: Language;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}