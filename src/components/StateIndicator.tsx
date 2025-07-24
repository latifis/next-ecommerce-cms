'use client';

import Image from 'next/image';

type StateIndicatorProps = {
    isLoading?: boolean;
    isError?: boolean;
    loadingMessage?: string;
    errorMessage?: string;
    loadingImage?: string;
    errorImage?: string;
    title?: string;
    description?: string;
    className?: string;
    isOverlay?: boolean;
};

export default function StateIndicator(props: StateIndicatorProps) {
    const {
        isLoading = false,
        isError = false,
        loadingImage = '/images/icons/loading.png',
        errorImage = '/images/icons/something-went-wrong.png',
        title = 'Something Went Wrong',
        description = "An unexpected error occurred. Please try again later or contact support if the issue persists.",
        className = '',
        isOverlay = false,
    } = props;

    if (isLoading) {
        const content = (
            <div className={`flex h-full w-full flex-col items-center justify-center py-8 ${className}`}>
                <Image
                    src={loadingImage}
                    alt="Loading..."
                    width={64}
                    height={64}
                    className="animate-spin"
                />
            </div>
        );

        return isOverlay ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                {content}
            </div>
        ) : content;
    }

    if (isError) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center text-center px-4">
                <Image
                    src={errorImage}
                    alt="Error illustration"
                    width={240}
                    height={240}
                    className="mb-6"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
                <p className="text-sm text-gray-500 max-w-md">{description}</p>
            </div>
        );
    }

    return null;
}
