// データベースから、積本や保留本、読了本一覧を作成するためのコンポーネント
"use client";

import { useState } from "react";
import BookCard from "./BookCard";
import BookDetailDialog from "./BookDetail";
import type { Book } from "@/types/book";
import Toast from "./Toast";

export default function BooksPage({
  prop,
  books,
}: {
  prop: string;
  books: Book[];
}) {
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const targetBooks: Book[] = books.filter((book) => book.status == prop);

  const booksToShow: Book[] = showAll ? targetBooks : targetBooks.slice(0, 8);

  function databaseUpdated(b: Boolean) {
    if (b) {
      setSelectedBook(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } else {
      setSelectedBook(null);
    }
  }

  return (
    <div className="p-6">
      {prop == "store" && (
        <h1 className="text-2xl font-bold mb-4 text-left">積み本一覧</h1>
      )}
      {prop == "reserve" && (
        <h1 className="text-2xl font-bold mb-4 text-left">購入検討本一覧</h1>
      )}
      {prop == "read" && (
        <h1 className="text-2xl font-bold mb-4 text-left">読了本一覧</h1>
      )}

      {targetBooks.length === 0 && (
        <div className="w-full h-32 flex items-center justify-center text-sm">
          該当する本がありません
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {booksToShow.map((book: Book) => (
          <BookCard
            key={book.isbn}
            book={book}
            onClick={() => setSelectedBook(book)}
          />
        ))}
      </div>

      {/* 開閉ボタン（本が 9 冊より多いときに表示） */}
      {targetBooks.length > 8 && (
        <div className="flex justify-center mt-4">
          <button
            className="rounded-2xl px-4 bg-white text-black outline-1 outline-black hover:bg-gray-100"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "表示数を減らす" : "すべて表示"}
          </button>
        </div>
      )}

      {selectedBook && (
        <BookDetailDialog
          book={selectedBook}
          onClose={(b: Boolean = false) => databaseUpdated(b)}
        />
      )}

      {showToast && <Toast message="本一覧を更新しました" />}
    </div>
  );
}
