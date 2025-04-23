export const metadata = {
  title: 'Loading',
};

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="relative w-16 h-16 border-t-4 border-b-4 border-gray-500 rounded-full animate-spin"></div>
      <h1 className="text-gray-700 text-2xl font-semibold mt-8">
        Please Wait, Loading...
      </h1>
      <p className="text-gray-600 mt-4 text-center max-w-sm">
        We are preparing the best content for you. This process may take a few seconds. Thank you for your patience!
      </p>
    </div>
  );
}
