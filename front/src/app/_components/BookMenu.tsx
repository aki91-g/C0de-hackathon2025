// データベースから、積本や保留本、読了本一覧を作成するためのコンポーネント
"use client";

import { useState } from "react";
import BookCard from "./BookCard";
import BookDetailDialog from "./BookDetail";
import type { Book } from "@/types/book";

// const mockBooks = [{ title: "title1", author: "author1", isbn: "isbn1", cover_image_url: "url1", description: "description1", status: "store"}];
//   for (let i = 2; i<=20; i++){
//     var s = "";
//     if (i%5 === 2) s = "reserve";
//     else if (i%5 === -1) s = "read";
//     else s = "store";
//     mockBooks.push({ title: "title"+i.toString(), author: "author"+i.toString(), isbn: "isbn"+i.toString(), cover_image_url: "url"+i.toString() , description: "description"+i.toString(), status: s})
//   }

// テストとはいえ複数存在するコンポーネントでやってたのは馬鹿
// const BACKEND_BASE_URL =
//   process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

// async function mockPost(): Promise<Book> {
//   try {
//     const response = await fetch(`${BACKEND_BASE_URL}/books/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ title: "title1", author: "author1", isbn: "isbn1", cover_image_url: "url1", description: "description1", status: "store",}),
//     });

//     if (!response.ok) {
//       throw new Error(`Backend responded with ${response.status}`);
//     }
//     return (await response.json()) as Book;
//   } catch {
//     return {
//       title: "",
//       author: "",
//       isbn: "",
//       cover_image_url: "",
//       description: "Error",
//       status: "",
//       last_modified: "",
//       status_changed_at: "",
//       id: -1,
//     };
//   }
// }

// async function mockDelete(): Promise<Book> {
//   try {
//     const response = await fetch(`${BACKEND_BASE_URL}/books/1`, {
//       method: "DELETE",
//     });

//     if (!response.ok) {
//       throw new Error(`Backend responded with ${response.status}`);
//     }
//     return (await response.json()) as Book;
//   } catch {
//     return {
//       title: "",
//       author: "",
//       isbn: "",
//       cover_image_url: "",
//       description: "Error",
//       status: "",
//       last_modified: "",
//       status_changed_at: "",
//       id: -1,
//     };
//   }
// }

// const test_post = await mockPost();
// console.log(test_post);
// const test_delete = await mockDelete();
// console.log(test_delete);

export default function BooksPage({ prop, books }: { prop: string, books: Book[]}) {
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [showAll, setShowAll] = useState(false);

  const targetBooks: Book[] = books.filter((book) => book.status == prop)

  const booksToShow: Book[] = showAll ? targetBooks : targetBooks.slice(0, 8);

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