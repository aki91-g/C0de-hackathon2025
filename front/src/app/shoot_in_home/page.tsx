"use client";

import BarcodeReader from "../_components/BarcodeReader";
import { useRouter } from "next/navigation";
import { CornerDownLeft } from "lucide-react";

export default function ShootInHome() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col gap-5 py-20 px-8 text-black dark:text-zinc-50 sm:px-16">
        <h1 className="text-center text-lg font-bold">
          バーコードを読み取らせてください。
        </h1>
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
          <button
            onClick={() => {
              router.back();
              router.refresh();
            }}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-500 text-white shadow-xl hover:bg-blue-700 transition"
          >
            {" "}
            <CornerDownLeft size={32} />{" "}
          </button>
        </div>
        <BarcodeReader bookRegisterMode="reserve" />
        <div className="flex flex-row justify-between px-4">
          <p>保存先：</p>
          <p>積み本</p>
        </div>
      </main>
    </div>
  );
}
