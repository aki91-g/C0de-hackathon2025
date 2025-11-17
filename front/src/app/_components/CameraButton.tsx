"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export default function FabMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {/* メニュー1 */}
      {open && (
        <button
          onClick={() => router.push("/shoot_in_store")}
          className="bg-white shadow-lg px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition outline-1 outline-black"
        >
          店頭で購入検討本に登録
        </button>
      )}

      {/* メニュー2 */}
      {open && (
        <button
          onClick={() => router.push("/shoot_in_home")}
          className="bg-white shadow-lg px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition outline-1 outline-black"
        >
          家で積み本に登録
        </button>
      )}

      {/* メインFAB */}
      {open ? 
      <button onClick={() => setOpen(!open)} 
        className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-black shadow-xl hover:bg-gray-100 transition"
      > <X size={32} /> </button> : 
      <button onClick={() => setOpen(!open)}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition"
      > <Plus size={32} /> </button>}
    </div>
  );
}