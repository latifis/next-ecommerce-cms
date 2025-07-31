import Image from "next/image";

type StateIndicatorProps = {
  notFoundImage?: string;
  title?: string;
  description?: string;
  className?: string;
};

export const DataNotFound = (props: StateIndicatorProps) => {
  const {
    notFoundImage = '/images/data-not-found.png',
    title = 'Data Not Found',
    description = "We couldn&apos;t find any data to display. Please try again later or return to the homepage.",
    className,
  } = props;
  return (
    <div
      className={
        className ||
        "flex flex-col items-center justify-center bg-white/80 border border-blue-200 rounded-2xl shadow-md p-6 text-gray-700"
      }
    >
      {/* Image Section */}
      <div className="mb-4">
        <Image
          src={notFoundImage}
          alt="Data Not Found"
          width={250}
          height={250}
          priority
          className="w-full max-w-xs sm:max-w-sm"
        />
      </div>

      {/* Text Section */}
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          {title}
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
