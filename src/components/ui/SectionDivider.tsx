type SectionDividerProps = {
    label: string;
    className?: string;
};

export function SectionDivider({ label, className = "" }: SectionDividerProps) {
    return (
        <div className={`flex items-center gap-4 ${className}`}>
            <div className="flex-grow border-t border-blue-400" />
            <span className="text-sm text-blue-700 font-semibold bg-white px-2">
                {label}
            </span>
            <div className="flex-grow border-t border-blue-400" />
        </div>
    );
}
