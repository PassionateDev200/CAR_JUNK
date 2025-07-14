/** route: src/components/ui/toaster.jsx */
"use client";
import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

let toastId = 0;
const toasts = new Map();
const listeners = new Set();

export function toast(message, options = {}) {
  const id = ++toastId;
  const newToast = {
    id,
    message,
    type: options.type || "info",
    duration: options.duration || 5000,
    ...options,
  };

  toasts.set(id, newToast);
  listeners.forEach((listener) => listener());

  if (newToast.duration > 0) {
    setTimeout(() => {
      toasts.delete(id);
      listeners.forEach((listener) => listener());
    }, newToast.duration);
  }

  return id;
}

toast.success = (message, options) =>
  toast(message, { ...options, type: "success" });
toast.error = (message, options) =>
  toast(message, { ...options, type: "error" });
toast.warning = (message, options) =>
  toast(message, { ...options, type: "warning" });
toast.info = (message, options) => toast(message, { ...options, type: "info" });

export function Toaster() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const dismiss = (id) => {
    toasts.delete(id);
    listeners.forEach((listener) => listener());
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {Array.from(toasts.values()).map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg border shadow-lg max-w-sm animate-in slide-in-from-right ${getStyles(
            toast.type
          )}`}
        >
          <div className="flex items-start gap-3">
            {getIcon(toast.type)}
            <p className="text-sm font-medium text-gray-900 flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
