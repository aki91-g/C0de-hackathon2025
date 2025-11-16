"use client"

import { BrowserMultiFormatReader } from '@zxing/browser';
import { useEffect, useState, useRef } from 'react';

export default function BarcodeReader() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [resultText, setResultText] = useState("");

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        let stopFn: (()=>void) | undefined;

        codeReader
        .decodeFromVideoDevice(undefined, videoRef.current!, (result, err) => {
            if (result) setResultText(result.getText());
        })
        console.log("Started continous decode from camera.")
    }, []);

    return (
        <div>
            <div
            style={{
                padding: "12px",
                marginBottom: "12px",
                background: "#eee",
                fontSize: "1.2rem",
                color: resultText ? "green" : "red",
            }}
            >
                {resultText ? `Detected: ${resultText}` : "Not Detected"}
            </div>
            <video ref={videoRef} style={{width: "100%"}}/>
        </div>
    );
}