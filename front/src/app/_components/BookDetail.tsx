"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import type { Book } from "@/types/book";
import DialogToStore from "./DialogToStore";
import DialogToRead from "./DialogToread";
import DialogToDelete from "./DialogToDelete";
import { useRouter } from "next/navigation";
import NumberInput from "./NumberInput";

export default function BookDetailDialog({
  book,
  onClose,
}: {
  book: Book;
  onClose: any;
}) {
  const [hasError, setHasError] = useState(false);
  const [dialog, setDialog] = useState("");
  const router = useRouter();

  function databaseUpdated(b: Boolean) {
    if (b) {
      onClose(true);
      setDialog("");
      router.refresh();
    } else {
      setDialog("");
    }
  }

  function dateFormat(str: string) {
    const date = new Date(str);
    const formatter = new Intl.DateTimeFormat("ja-JP", {
      month: "long", // "2月"
      day: "numeric", // "14日"
    });
    return formatter.format(date);
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {/* 画像 */}
          {book.cover_image_url && !hasError ? (
            <div className="w-full h-40 flex items-center justify-center">
              <Image
                src={book.cover_image_url}
                alt="image"
                width={800}
                height={800}
                onError={() => setHasError(true)}
                className="object-contain max-h-44"
              />
            </div>
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
              NO IMAGE
            </div>
          )}

          <div className="h-24 flex justify-between py-4">
            {book.status === "store" && (
              <div className="w-1/2 px-8">
                <h2 className="font-bold mb-1">積んだ日</h2>
                {dateFormat(book.status_store_at)}
              </div>
            )}
            {book.status === "reserve" && (
              <div className="w-1/2 px-8">
                <h2 className="font-bold mb-1">登録日</h2>
                {dateFormat(book.status_reserve_at)}
              </div>
            )}
            {book.status === "read" && (
              <div className="w-1/2 px-8">
                <h2 className="font-bold mb-1">読了日</h2>
                {dateFormat(book.status_read_at)}
              </div>
            )}
            <div>
              <h2 className="font-bold mb-1">購入金額</h2>
              <NumberInput book={book} />円
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-between items-center pt-2">
            <div className="w-1/3"></div> {/*ダミー*/}
            <div className="w-1/3 flex justify-center">
              {book.status === "reserve" && (
                <button
                  className="rounded px-4 py-2 bg-orange-500 text-white font-bold hover:bg-orange-600"
                  onClick={() => setDialog("store")}
                >
                  積み本に追加
                </button>
              )}
              {book.status === "store" && (
                <button
                  className="rounded px-4 py-2 bg-orange-500 text-white font-bold hover:bg-orange-600"
                  onClick={() => setDialog("read")}
                >
                  読了!
                </button>
              )}
            </div>
            <div className="w-1/3 flex justify-end">
              <button
                className="rounded px-4 py-2 bg-white text-black outline-1 outline-black hover:bg-gray-100"
                onClick={() => setDialog("delete")}
              >
                削除
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
      {dialog === "store" && (
        <DialogToStore
          book={book}
          onClose={(b: Boolean = false) => databaseUpdated(b)}
        />
      )}
      {dialog === "read" && (
        <DialogToRead
          book={book}
          onClose={(b: Boolean = false) => databaseUpdated(b)}
        />
      )}
      {dialog === "delete" && (
        <DialogToDelete
          book={book}
          onClose={(b: Boolean = false) => databaseUpdated(b)}
        />
      )}
    </Dialog>
  );
}
