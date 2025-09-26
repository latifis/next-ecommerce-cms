import React from "react";

type SwitchToggleProps<T extends string> = {
    value: T;
    options: { value: T; label: string }[];
    onChange: (val: T) => void;
    className?: string;
    disabled?: boolean;
    isMini?: boolean;
};

export default function SwitchToggle<T extends string>({
    value,
    options,
    onChange,
    className,
    disabled = false,
    isMini = false,
}: SwitchToggleProps<T>) {
    const activeIndex = options.findIndex((opt) => opt.value === value);

    if (isMini) {
        return (
            <div
                className={`relative flex items-center rounded-full w-[36px] h-[20px] 
      ${activeIndex === 1 ? "bg-blue-500" : "bg-gray-400"} 
      ${className || ""} 
      ${disabled ? "opacity-50 pointer-events-none" : ""}`}
                style={{ minWidth: "36px" }}
            >
                <button
                    type="button"
                    className="relative w-full h-full rounded-full transition-colors duration-300"
                    onClick={() => {
                        const nextIndex = activeIndex === 1 ? 0 : 1;
                        if (!disabled) {
                            onChange(options[nextIndex].value);
                        }
                    }}
                    disabled={disabled}
                    aria-label="Toggle"
                >
                    <span
                        className="absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-all duration-300"
                        style={{
                            width: "16px",
                            height: "16px",
                            transform: `translateX(${activeIndex === 1 ? 16 : 0}px)`,
                        }}
                    />
                </button>
            </div>
        );
    }

    return (
        <div
            className={`relative flex rounded-full bg-blue-500 p-1 w-fit ${className || ""} ${disabled ? "opacity-50 pointer-events-none" : ""}`}
            style={{ minWidth: `${options.length * 120}px` }}
        >
            <div
                className="absolute top-1 bottom-1 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out"
                style={{
                    width: `calc(100% / ${options.length} - 4px)`,
                    left: `calc(${activeIndex} * 100% / ${options.length} + 2px)`,
                }}
            />

            {options.map((opt) => (
                <button
                    key={opt.value}
                    className={`relative z-10 flex-1 px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-300 ${value === opt.value ? "text-blue-500" : "text-white"}`}
                    onClick={() => !disabled && onChange(opt.value)}
                    style={{ minWidth: "120px", border: "none", outline: "none" }}
                    disabled={disabled}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}