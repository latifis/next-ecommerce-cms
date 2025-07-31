interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: React.ReactNode;
    actionProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    actionElement?: React.ReactNode;
    className?: string;
}

export default function PageHeader({
    title,
    subtitle,
    actionLabel,
    onAction,
    actionIcon,
    actionProps,
    actionElement,
    className = "",
}: PageHeaderProps) {
    return (
        <div className={`flex justify-between items-center ${className}`}>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                {subtitle && (
                    <p className="text-gray-600 text-sm mt-2">{subtitle}</p>
                )}
            </div>
            {actionElement ? (
                actionElement
            ) : (
                actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-lg shadow hover:bg-blue-200"
                        {...actionProps}
                    >
                        {actionIcon}
                        <span>{actionLabel}</span>
                    </button>
                )
            )}
        </div>
    );
}