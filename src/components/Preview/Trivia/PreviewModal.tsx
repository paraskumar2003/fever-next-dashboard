import { ReactNode } from "react";

export interface ModalProps {
  show: boolean;
  toggleModal?: () => void;
  children?: ReactNode; // Allows dynamic content inside the modal
  closeButton?: boolean;
  onClose?: Function;
  backDrop?: boolean;
  bgColor?: string;
}

export function PreviewModal({
  show,
  toggleModal,
  closeButton,
  onClose,
  children,
  bgColor,
  backDrop = true,
}: ModalProps): React.JSX.Element {
  return (
    <>
      {/* Modal and backdrop */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed absolute inset-0 bottom-0 left-[-20px] top-0 top-[-25px] z-[-1] min-h-[90px] w-[130%] -rotate-3 transform overflow-hidden rounded-t-2xl bg-black opacity-50"
            onClick={() => {
              if (backDrop) {
                if (onClose) onClose();
              }
            }}
          ></div>

          {/* Modal */}
          <div
            className="relative m-2 w-[80%] scale-90 transform rounded-lg  bg-[#fff] shadow-lg  transition-transform duration-300 ease-out"
            style={{
              animation: "fall 0.3s ease-out forwards",
              ...(bgColor ? { backgroundColor: bgColor } : {}),
            }}
          >
            {/* Optional children content */}
            {children && <div>{children}</div>}

            {closeButton && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={toggleModal}
                  className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Falling animation in Tailwind CSS */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
