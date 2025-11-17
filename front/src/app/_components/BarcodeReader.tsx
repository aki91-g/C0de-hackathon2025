"use client"

import { BrowserMultiFormatReader } from '@zxing/browser';
import { useEffect, useState, useRef } from 'react';

export default function BarcodeReader() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [resultText, setResultText] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        let stopFn: (()=>void) | undefined;

        codeReader
        .decodeFromVideoDevice(undefined, videoRef.current!, (result, err) => {
            if (result) {
                setResultText(result.getText());
                setModalOpen(true);
            }
        })
        console.log("Started continous decode from camera.")
    }, []);

    useEffect(() => {
        if (resultText) {
            setBookTitle("吾輩は猫である");
        }
    }, [resultText]);

    return (
        <>
            {
                (resultText && modalOpen) && ( 
                <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
                    <p>「{bookTitle}」で間違いありませんか？</p>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="mx-4 my-10 px-4 py-2 bg-gray-300 rounded"
                        >
                        確認
                    </button>
                </div>
                )
            }
            <video ref={videoRef} style={{width: "100%"}}/>
        </>
    );
}