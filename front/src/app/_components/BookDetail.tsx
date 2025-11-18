"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import type { Book } from "@/types/book"

export default function BookDetailDialog({ book, onClose }: { book: Book, onClose: any }) {
  const [memo, setMemo] = useState("");
  const [hasError, setHasError] = useState(false);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 画像 */}
          {book.cover_image_url && !hasError ? 
            <div className="w-full h-40 flex items-center justify-center">
              <Image src={book.cover_image_url} alt="image" width={800} height={800} onError={() => setHasError(true)} 
                className="object-contain max-h-44"/>
            </div>
              :
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
              NO IMAGE
            </div>
          }

          {/* あらすじ */}
          <div>
            <h2 className="font-bold">あらすじ</h2>
            <p className="text-sm">{book.description}</p>
          </div>

          {/* メモ入力欄 */}
          <div>
            <h2 className="font-bold mb-1">メモ</h2>
            <Textarea
              placeholder="ここにメモを入力"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-between pt-2">
            <button className="rounded px-4 py-2 bg-black text-white hover:bg-gray-900">編集</button>
            <button className="rounded px-4 py-2 bg-white text-black outline-1 outline-black hover:bg-gray-100">削除</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}