"use client"

import { BrowserMultiFormatReader } from '@zxing/browser';
import { useEffect, useState, useRef } from 'react';

enum RegisterStatus {
    SUCCESS,
    ALREADY_REGISTERED,
    FAILURE
}

const registerBook = async (isbn: string): Promise<RegisterStatus> => {
    try {
        const response = await fetch("/api/books/external/", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ isbn }),
        });

        if (!response.ok) {
            if (response.status === 409) {
                return RegisterStatus.ALREADY_REGISTERED;
            }
            throw new Error("Failed to register book");
        }
        console.log("Book registered successfully");
    } catch (error) {
        console.error("Error registering book:", error);
        return RegisterStatus.FAILURE;
    }

    return RegisterStatus.SUCCESS;
};

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    confirmText?: string;
}

type ModalType = "confirm" | "result" | null;

function Modal({open, onClose, title, message, confirmText="確認"}: ModalProps) {
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

export default function BarcodeReader() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isbnText, setISBNText] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalConfirmText, setModalConfirmText] = useState("");
    const [modalType, setModalType] = useState<ModalType>(null);
    let scanning = true;

    const handleClose = async () => {
        if (modalType === "confirm") {
            console.log("Registering book with ISBN:", isbnText);
            const result = await registerBook(isbnText);

            setModalType("result");
            if (result === RegisterStatus.SUCCESS) {
                setModalMessage("登録が完了しました。");
            } else if (result === RegisterStatus.ALREADY_REGISTERED) {
                setModalMessage("この書籍は既に登録されています。");
            } else {
                setModalMessage("登録に失敗しました。");
            }

            setModalTitle("登録結果");
            setModalConfirmText("閉じる");
        } else if (modalType === "result") {
            setModalType(null);
            setISBNText("");
            scanning = true;
        }
    }

    useEffect(() => {
        if (modalType !== null) return;
        const codeReader = new BrowserMultiFormatReader();

        if (videoRef.current) {
            codeReader
            .decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
                if (result && scanning) {
                    scanning = false;
                    setISBNText(result.getText());
                }
            })
        }

        return () => {
        }
    }, []);

    useEffect(() => {
        console.log("ISBN Detected: ", isbnText);
        if (isbnText.length == 0) return;

        const fetchBook = async () => {
            try {
                const response = await fetch(`/api/external/bookinfo/${isbnText}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", },
                });
                if (!response.ok) throw new Error("Failed to fetch book info");
                const data = await response.json();
                setModalType("confirm");
                setModalTitle("書籍登録確認");
                setModalMessage(`タイトル: ${data.title}\nISBN: ${isbnText}`);
                setModalConfirmText("登録する");
            } catch (error) {
                console.error("Error fetching book info:", error);
                setModalType("result");
                setModalTitle("エラー");
                setModalMessage("書籍情報の取得に失敗しました。");
                setModalConfirmText("閉じる");
            }
        };

        fetchBook();
    }, [isbnText]);

    return (
    <>
        <Modal
            open={modalType !== null}
            onClose={() => handleClose()}
            title={modalTitle}
            message={modalMessage}
            confirmText={modalConfirmText}
        ></Modal>
        <video ref={videoRef} style={{width: "100%"}}/>
        <button onClick={() => {
            setISBNText("9784102134054");
        }} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            バーコード読み取りテスト
        </button>
    </>
    );
}