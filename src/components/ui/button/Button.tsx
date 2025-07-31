import React, { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";

type ButtonProps = {
    children: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    variant?: "primary" | "secondary" | "danger";
    className?: string;
    icon?: ReactNode;
};

export default function Button({
    children,
    onClick,
    type = "button",
    disabled = false,
    loading = false,
    variant = "primary",
    className = "",
    icon,
}: ButtonProps) {
    const base =
        "px-7 py-3 rounded-md text-sm font-medium flex items-center justify-center focus:outline-none focus:ring-2 transition-all duration-150 gap-4";
    const variants = {
        primary: "text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-300",
        secondary: "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-200",
        danger: "text-white bg-red-500 hover:bg-red-600 focus:ring-red-300",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${className}`}
            disabled={disabled || loading}
        >
            {loading && <span className="mr-2"><FaSpinner className="animate-spin" /></span>}
            {icon && !loading && <span className="mr-2">{icon}</span>}
            {loading ? (typeof children === "string" ? `${children}...` : children) : children}
        </button>
    );
}