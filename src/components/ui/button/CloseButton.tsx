import { FaTimes } from 'react-icons/fa';

type CloseButtonProps = {
    onClick?: () => void;
    className?: string;
};

export default function CloseButton({ onClick, className = '' }: CloseButtonProps) {
    return (
        <button
            onClick={onClick}
            aria-label="Close"
            className={`p-2 rounded-full bg-transparent focus:outline-none focus:ring-0 ${className}`}
        >
            <FaTimes
                size={25}
                className="text-red-700 hover:text-red-500 transform hover:scale-110 transition duration-200"
            />
        </button>
    );
}
