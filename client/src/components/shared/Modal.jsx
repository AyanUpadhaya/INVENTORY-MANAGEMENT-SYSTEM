import { Fragment } from "react";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({ open, onClose, size = "md", children }) {
  if (!open) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`w-full ${sizeClasses[size]} bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </Fragment>
  );
}


export function ModalHeader({ children }) {
  return (
    <div className="px-6 py-4 border-b">
      <h2 className="text-lg font-semibold">{children}</h2>
    </div>
  );
}

export function ModalBody({ children }) {
  return (
    <div className="px-6 py-4 overflow-y-auto flex-1">
      {children}
    </div>
  );
}

export function ModalFooter({ onClose, children }) {
  return (
    <div className="px-6 py-4 border-t flex justify-end gap-2">
      {children}
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100"
      >
        Close
      </button>
    </div>
  );
}
