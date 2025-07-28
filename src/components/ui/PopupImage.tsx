import React from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

interface PopupImageProps {
    visible: boolean;
    onClose: () => void;
    imageUrl: string;
    alt?: string;
    width?: number;
    height?: number;
}

const PopupImage: React.FC<PopupImageProps> = ({
    visible,
    onClose,
    imageUrl,
    alt = "Image",
    width = 600,
    height = 600,
}) => {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
            onClick={onClose}
        >
            <div
                className="relative bg-white p-2 border border-gray-300 shadow-lg"
                style={{ width, height }}
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={imageUrl}
                    alt={alt}
                    fill
                    className="object-contain"
                />
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors"
                    onClick={onClose}
                    type="button"
                >
                    <FaTimes className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default PopupImage;