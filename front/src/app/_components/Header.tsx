"use client";

// import { useState } from "react";
// import { Menu, X } from "lucide-react";

export default function Header() {
  // const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b bg-black">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* 左端：サイト名 */}
        <div className="text-xl font-bold text-white">
          <a href="/">済読アプリ とにかくよめ!!</a>
        </div>

        {/* 右端：ログインボタン & ハンバーガー */}
        {/* <div className="flex items-center gap-4">
          <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            ログイン
          </button> */}

          {/* ハンバーガー */}
          {/* <button
            className="text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div> */}
      </div>

      {/* モバイルメニュー */}
      {/* {open && (
        <div className="border-t bg-gray-50 px-4 py-3">
          <a href="/" className="block py-2">
            項目1
          </a>
          <a href="/" className="block py-2">
            項目2
          </a>
          <a href="/" className="block py-2">
            項目3
          </a>
        </div>
      )} */}
    </header>
  );
}
