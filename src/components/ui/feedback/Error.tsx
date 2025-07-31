import { AiOutlineReload } from 'react-icons/ai';

function ErrorComponent() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 border border-gray-300 rounded-lg shadow-xl text-center max-w-lg">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Oops! Something Went Wrong</h2>
                <p className="text-gray-600 mb-8 text-lg">
                    Sorry, there was an error while loading the page. Please try reloading to continue.
                </p>
                <div className="flex justify-center">
                    <button
                        className="bg-blue-400 hover:bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md flex items-center transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => window.location.reload()}
                    >
                        <AiOutlineReload size={22} className="mr-3" />
                        <span className="font-medium">Reload Now</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ErrorComponent;
