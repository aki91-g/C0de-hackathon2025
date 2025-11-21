type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    confirmText?: string;
}

export type ModalType = "confirm" | "result" | null;

export function Modal({open, onClose, title, message, confirmText="確認"}: ModalProps) {
    if (!open) return null;
    return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        <p className="mb-6 text-center whitespace-pre-line">{message}</p>
        <button
            onClick={onClose}
            className="mx-4 my-10 px-4 py-2 bg-gray-300 rounded"
        >
            {confirmText}
        </button>
    </div>)
}