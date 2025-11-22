"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useState, useRef } from "react";
import { Modal, ModalType } from "./BarcodeReaderModal";

enum RegisterStatus {
  SUCCESS,
  ALREADY_REGISTERED,
  FAILURE,
}

const registerReserveBook = async (isbn: string): Promise<RegisterStatus> => {
  try {
    const response = await fetch("/api/books/external/reserve/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

const registerStoreBook = async (isbn: string): Promise<RegisterStatus> => {
  try {
    const response = await fetch("/api/books/external/store/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

type BarcodeReaderProps = {
  bookRegisterMode: "store" | "reserve";
};

export default function BarcodeReader({
  bookRegisterMode,
}: BarcodeReaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isbnText, setISBNText] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalConfirmText, setModalConfirmText] = useState("");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalSecondText, setModalSecondText] = useState("");
  const [onCloseSecond, setOnCloseSecond] = useState<(() => void) | undefined>(
    undefined,
  );
  let scanning = true;

  const handleClose = async () => {
    if (modalType === "confirm") {
      console.log("Registering book with ISBN:", isbnText);
      let result: RegisterStatus;
      if (bookRegisterMode === "reserve") {
        result = await registerReserveBook(isbnText);
      } else {
        result = await registerStoreBook(isbnText);
      }

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
      setModalSecondText("");
      setOnCloseSecond(undefined);
    } else if (modalType === "result") {
      setModalType(null);
      setISBNText("");
      scanning = true;
    }
  };

  useEffect(() => {
    if (modalType !== null) return;
    const codeReader = new BrowserMultiFormatReader();

    if (videoRef.current) {
      codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, err) => {
          if (result && scanning) {
            scanning = false;
            setISBNText(result.getText());
          }
        },
      );
    }

    return () => {};
  }, []);

  useEffect(() => {
    console.log("ISBN Detected: ", isbnText);
    if (isbnText.length == 0) return;

    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/external/bookinfo/${isbnText}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch book info");
        const data = await response.json();
        setModalType("confirm");
        setModalTitle("書籍登録確認");
        setModalMessage(`タイトル: ${data.title}\nISBN: ${isbnText}`);
        setModalConfirmText("登録する");
        setModalSecondText("キャンセル");
        setOnCloseSecond(() => () => {
          setModalType(null);
          setISBNText("");
          scanning = true;
        });
      } catch (error) {
        console.error("Error fetching book info:", error);
        setModalType("result");
        setModalTitle("エラー");
        setModalMessage("書籍情報の取得に失敗しました。");
        setModalConfirmText("閉じる");
        setModalSecondText("");
        setOnCloseSecond(undefined);
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
        buttonColor={
          modalType === "confirm"
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-300 hover:bg-gray-400"
        }
        secondText={modalSecondText}
        onCloseSecond={onCloseSecond}
      ></Modal>
      <video ref={videoRef} className="w-full" />
      {/* ここから Test 用コードです*/}
      <button
        onClick={() => {
          setISBNText("9784087700039");
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        バーコード読み取りテスト（森羅記）
      </button>
      <button
        onClick={() => {
          setISBNText("9784061595842");
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        バーコード読み取りテスト（明治維新）
      </button>
      <button
        onClick={() => {
          setISBNText("9784102134054");
        }}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
      >
        バーコード読み取りテスト（シャーロックホームズ 緋色の研究）
      </button>
      {/* ここまで Test 用コードです*/}
    </>
  );
}
