import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        className
      )}
      {...props}
    />
  );
}

// Also export as default for flexibility
export default LoadingSpinner;
