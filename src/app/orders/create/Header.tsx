import { FaPlus } from "react-icons/fa";

type Props = {
    onClick: () => void;
};

export default function Header({ onClick }: Props) {
    return (
        <div className="mb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Create Order</h1>
                    <p className="text-gray-600 text-sm">
                        Scan or select product to add to order.
                    </p>
                </div>
                <button
                    onClick={onClick}
                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-lg shadow hover:bg-blue-200"
                >
                    <FaPlus />
                    <span>Add / Search Product</span>
                </button>
            </div>
        </div>
    )
}