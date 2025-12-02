"use client";
import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export const useMobileToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", duration = 2000) => {
      const id = Date.now().toString();
      const newToast: ToastMessage = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};

interface MobileToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const MobileToastItem = ({ toast, onClose }: MobileToastProps) => {
  const bgColor =
    toast.type === "success"
      ? "bg-green-500"
      : toast.type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in-up max-w-xs`}
      role="alert"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          onClick={() => onClose(toast.id)}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

interface MobileToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const MobileToastContainer = ({
  toasts,
  onClose,
}: MobileToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none md:hidden">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <MobileToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};
