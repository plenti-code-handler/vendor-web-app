"use client";

const SecondaryButton = ({
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
      className={`group relative flex items-center justify-center px-6 py-3 border text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
        isDisabled
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed scale-100 hover:scale-100"
          : "bg-purple-50 text-[#5F22D9] border-purple-200 hover:bg-purple-100 hover:border-purple-300"
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#5F22D9] border-t-transparent" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default SecondaryButton;
