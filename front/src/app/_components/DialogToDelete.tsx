"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Book } from "@/types/book"

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

async function deleteBook(book: Book): Promise<Book> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/books/${book.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }
    return (await response.json()) as Book;
  } catch {
    return {
      title: "",
      author: "",
      isbn: "",
      cover_image_url: "",
      description: "Error",
      status: "",
      last_modified: "",
      status_changed_at: "",
      id: -1,
    };
  }
}

export default function DialogToDelete({ book, onClose }: { book: Book, onClose: any }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-80!">
        <DialogHeader>
          <DialogTitle>
            <div className="text-center">確認</div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 確認メッセージ */}
          <div>
            <h3 className="max-w-80 text-center">「{book.title}」を一覧から削除しますか?</h3>
          </div>

          {/* ボタン */}
          <div className="flex justify-between items-center pt-2">
            <button className="rounded px-8 py-2 bg-yellow-500 text-black outline-1 outline-black hover:bg-yellow-600"
                    onClick={async () => {
                      deleteBook(book);
                      onClose(true);
                    }}>削除</button>
            <button className="rounded px-8 py-2 bg-white text-black outline-1 outline-black hover:bg-gray-100"
                    onClick={() => onClose(false)}>戻る</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}