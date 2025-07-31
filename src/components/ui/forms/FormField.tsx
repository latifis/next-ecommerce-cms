import React, { ChangeEvent, ForwardedRef } from "react";

type FormFieldProps = {
    label: string;
    id: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: "text" | "number" | "textarea";
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    min?: number;
    rows?: number;
    refProp?: ForwardedRef<HTMLInputElement>;
};

export default function FormField({
    label,
    id,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false,
    disabled = false,
    min,
    rows,
    refProp,
}: FormFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 pl-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {type === "textarea" ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                    placeholder={placeholder}
                    rows={rows || 4}
                    required={required}
                    disabled={disabled}
                />
            ) : (
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    min={min}
                    ref={refProp}
                    onWheel={type === "number" ? (e) => e.currentTarget.blur() : undefined}
                />
            )}
        </div>
    );
}