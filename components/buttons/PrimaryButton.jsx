"use client";

const PrimaryButton = ({
  type = "button",
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  children,
  className = "",
  fullWidth = false,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`group relative flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] ${
        isDisabled
          ? "bg-gray-400 cursor-not-allowed scale-100 hover:scale-100"
          : "bg-[#5F22D9] hover:bg-[#4A1BB8] shadow-lg hover:shadow-xl"
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default PrimaryButton;
