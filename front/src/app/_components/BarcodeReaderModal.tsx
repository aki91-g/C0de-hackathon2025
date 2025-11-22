type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  confirmTextColor?: string;
  buttonColor: string;
  secondText?: string;
  onCloseSecond?: () => void;
};

export type ModalType = "confirm" | "result" | null;

export function Modal({
  open,
  onClose,
  title,
  message,
  confirmText = "確認",
  buttonColor = "bg-blue-500",
  secondText = "",
  onCloseSecond = undefined,
}: ModalProps) {
  if (!open) return null;
  let className = `mx-4 my-10 px-4 py-2 ${buttonColor} rounded`;
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 ">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <p className="mb-6 text-center whitespace-pre-line">{message}</p>
      <div className="flex space-x-4">
        <button onClick={onClose} className={className}>
          {confirmText}
        </button>
        {secondText && (
          <button
            onClick={onCloseSecond}
            className="mx-4 my-10 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            {secondText}
          </button>
        )}
      </div>
    </div>
  );
}
