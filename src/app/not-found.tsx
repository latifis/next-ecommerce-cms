import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="container flex flex-col md:flex-row items-center justify-center min-h-screen px-6 py-8 text-gray-700 bg-white space-x-1">

      <div className="flex justify-center items-center mb-8 md:mb-0 md:w-1/2">
        <Image
          src="/images/not-found.png"
          alt="Not Found"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      <div className="text-center md:text-left md:w-1/2 md:ml-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-4">
          Oops! The page you&apos;re looking for cannot be found.
        </h2>
        <p className="text-base sm:text-lg text-gray-500 mb-6">
          It seems like the page you were trying to reach doesn&apos;t exist or has been moved. Please check the URL or return to the homepage.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 text-white bg-gray-800 rounded-lg font-medium text-lg transition-all duration-300 transform hover:bg-blue-400 hover:scale-105"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
