const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4 w-full">
      <div className="relative w-14 h-14">
        {/* Outer ring */}
        <div className="absolute w-full h-full border-4 border-primary-color/20 rounded-full"></div>
        {/* Spinning ring */}
        <div className="absolute w-full h-full border-4 border-t-primary-color border-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium">Loading data...</p>
    </div>
  );
};

export default LoadingSpinner;
