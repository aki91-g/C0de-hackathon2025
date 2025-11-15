// components/BookDetailDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function BookDetailDialog({ book, onClose }: any) {
  const [memo, setMemo] = useState("");

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 画像（現状 NO IMAGE） */}
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
            {book.image}
          </div>

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