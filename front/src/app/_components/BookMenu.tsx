// データベースから、積本や保留本、読了本一覧を作成するためのコンポーネント
"use client";

import { useState } from "react";
import BookCard from "./BookCard";
import BookDetailDialog from "./BookDetail";

export default function BooksPage({ prop }: { prop: string }) {
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [showAll, setShowAll] = useState(false);

  const mockBooks = [
    { id: "1", title: "タイトル1", image: "NO IMAGE", description: "あらすじ1" , condition: "read" },
    { id: "2", title: "タイトル2", image: "NO IMAGE", description: "あらすじ2" , condition: "reserve" },
    { id: "3", title: "タイトル3", image: "NO IMAGE", description: "あらすじ3" , condition: "store" },
    { id: "4", title: "タイトル4", image: "NO IMAGE", description: "あらすじ4" , condition: "store" },
    { id: "5", title: "タイトル5", image: "NO IMAGE", description: "あらすじ5" , condition: "store" },
    { id: "6", title: "タイトル6", image: "NO IMAGE", description: "あらすじ6" , condition: "store" },
    { id: "7", title: "タイトル7", image: "NO IMAGE", description: "あらすじ7" , condition: "reserve" },
    { id: "8", title: "タイトル8", image: "NO IMAGE", description: "あらすじ8" , condition: "store" },
    { id: "9", title: "タイトル9", image: "NO IMAGE", description: "あらすじ9" , condition: "store" },
    { id: "10", title: "タイトル10", image: "NO IMAGE", description: "あらすじ10" , condition: "read" },
    { id: "11", title: "タイトル11", image: "NO IMAGE", description: "あらすじ11" , condition: "store" },
    { id: "12", title: "タイトル12", image: "NO IMAGE", description: "あらすじ12" , condition: "read" },
    { id: "13", title: "タイトル13", image: "NO IMAGE", description: "あらすじ13" , condition: "reserve" },
    { id: "14", title: "タイトル14", image: "NO IMAGE", description: "あらすじ14" , condition: "store" },
    { id: "15", title: "タイトル15", image: "NO IMAGE", description: "あらすじ15" , condition: "store" },
    { id: "16", title: "タイトル16", image: "NO IMAGE", description: "あらすじ16" , condition: "store" },
    { id: "17", title: "タイトル17", image: "NO IMAGE", description: "あらすじ17" , condition: "store" },
    { id: "18", title: "タイトル18", image: "NO IMAGE", description: "あらすじ18" , condition: "reserve" },
    { id: "19", title: "タイトル19", image: "NO IMAGE", description: "あらすじ19" , condition: "store" },
    { id: "20", title: "タイトル20", image: "NO IMAGE", description: "あらすじ20" , condition: "store" },
    { id: "21", title: "タイトル21", image: "NO IMAGE", description: "あらすじ21" , condition: "read" },
    { id: "22", title: "タイトル22", image: "NO IMAGE", description: "あらすじ22" , condition: "store" },
  ];

  const targetBooks = mockBooks.filter((book) => book.condition == prop)

  const booksToShow = showAll ? targetBooks : targetBooks.slice(0, 8);

  return (
    <div className="p-6">
      {prop=="store" && (
        <h1 className="text-2xl font-bold mb-4 text-left">積み本一覧</h1>
      )}
      {prop=="reserve" && (
        <h1 className="text-2xl font-bold mb-4 text-left">購入検討本一覧</h1>
      )}
      {prop=="read" && (
        <h1 className="text-2xl font-bold mb-4 text-left">読了本一覧</h1>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {booksToShow.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => setSelectedBook(book)}
          />
        ))}
      </div>

       {/* 開閉ボタン（本が 9 冊より多いときに表示） */}
      {targetBooks.length > 8 && (
        <div className="flex justify-center mt-4">
          <button className="rounded-2xl px-4 bg-white text-black outline-1 outline-black hover:bg-gray-100"
                  onClick={() => setShowAll(!showAll)}>
            {showAll ? "表示数を減らす" : "すべて表示"}
          </button>
        </div>
      )}

      {selectedBook && (
        <BookDetailDialog
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}