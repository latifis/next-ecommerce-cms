import React from "react";

type Option = {
    value: string | number;
    label: string;
};

type FormSelectProps = {
    label: string;
    id: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    isLoading?: boolean;
};

export default function FormSelect({
    label,
    id,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
    placeholder = "Select an option",
    isLoading = false,
}: FormSelectProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled || isLoading}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-900"
            >
                <option value="" disabled>
                    {isLoading ? "Loading..." : placeholder}
                </option>
                {!isLoading &&
                    options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))
                }
            </select>
        </div>
    );
}