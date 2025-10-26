import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex justify-center items-center p-3 sm:p-4 md:p-6">
      {/* Main Content Container */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center space-y-4 sm:space-y-5 md:space-y-6">
        {/* Icon and 404 Number */}
        <div className="space-y-3 sm:space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto shadow-md border border-gray-200">
            <FaExclamationTriangle className="text-amber-500 text-3xl sm:text-4xl md:text-5xl" />
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed px-2 sm:px-4">
            Oops! The page you&apos;re looking for has wandered off into the
            digital void. Don&apos;t worry though - there are plenty of amazing
            projects waiting for you!
          </p>
        </div>

        {/* Compact Info Section */}
        <div className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg shadow-sm border border-gray-200 mx-2 sm:mx-4">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2">
            What Happened?
          </h3>
          <p className="text-gray-700 text-xs leading-relaxed">
            The blog post you&apos;re looking for might have been moved, or this
            link may be outdated. Don&apos;t worry - you can explore our latest
            articles!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-2 sm:px-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-md text-xs sm:text-sm">
            <FaHome className="text-sm sm:text-base" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-md text-xs sm:text-sm">
            <FaArrowLeft className="text-sm sm:text-base" />
            Go Back
          </button>
        </div>

        {/* Compact Encouraging Message */}
        <div className="pt-3 sm:pt-4 border-t border-gray-300 mx-2 sm:mx-4">
          <p className="text-gray-600 font-medium text-xs sm:text-sm italic">
            &quot;Great stories are waiting to be discovered - start exploring
            now!&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
