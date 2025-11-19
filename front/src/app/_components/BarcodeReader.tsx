"use client"

import { BrowserMultiFormatReader } from '@zxing/browser';
import { useEffect, useState, useRef } from 'react';

export default function BarcodeReader() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isbnText, setISBNText] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        if (videoRef.current) {
            codeReader
            .decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
                if (result) {
                    setISBNText(result.getText());
                    setModalOpen(true);
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
                const response = await fetch(`http://172.18.57.106:8000/external/bookinfo/${isbnText}`);
                if (!response.ok) throw new Error("Failed to fetch book info");
                const data = await response.json();
                setBookTitle(data.title);
                setModalOpen(true);
            } catch (error) {
                console.error("Error fetching book info:", error);
                setBookTitle("不明な書籍");
                setModalOpen(true);
            }
        };

        fetchBook();
    }, [isbnText]);

    return (
        <>
            {
                (modalOpen) && ( 
                <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
                    <p>「{bookTitle}」で間違いありませんか？</p>
                    <button
                        onClick={() => {
                            setModalOpen(false);
                            setBookTitle("");
                            setISBNText("");
                        }}
                        className="mx-4 my-10 px-4 py-2 bg-gray-300 rounded"
                        >
                        確認
                    </button>
                </div>
                )
            }
            <video ref={videoRef} style={{width: "100%"}}/>
            <button onClick={() => {
                setISBNText("9784087448221");
            }} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                バーコード読み取りテスト
            </button>
        </>
    );
}