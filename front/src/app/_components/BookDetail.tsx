"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import type { Book } from "@/types/book";
import DialogToStore from "./DialogToStore";
import DialogToRead from "./DialogToread";
import DialogToDelete from "./DialogToDelete";
import { useRouter } from "next/navigation";

export default function BookDetailDialog({ book, onClose }: { book: Book, onClose: any }) {
  const [memo, setMemo] = useState("");
  const [hasError, setHasError] = useState(false);
  const [dialog, setDialog] = useState("");
  const router = useRouter();

  function databaseUpdated(b: Boolean){
    if (b){
      onClose(true);
      setDialog("");
      router.refresh();
    }
    else{
      setDialog("");
    }
  }

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
          <div className="flex justify-between items-center pt-2">
            <div className="w-1/3"></div> {/*ダミー*/}
            <div className="w-1/3 flex justify-center">
              {book.status === "reserve" &&
                <button className="rounded px-4 py-2 bg-orange-500 text-white font-bold hover:bg-orange-600"
                        onClick={() => setDialog("store")}>積み本に追加</button>
              }
              {book.status === "store" &&
                <button className="rounded px-4 py-2 bg-orange-500 text-white font-bold hover:bg-orange-600"
                        onClick={() => setDialog("read")}>読了!</button>
              }
            </div>
            <div className="w-1/3 flex justify-end">
              <button className="rounded px-4 py-2 bg-white text-black outline-1 outline-black hover:bg-gray-100"
                      onClick={() => setDialog("delete")}>削除</button>
            </div>
          </div>
        </div>
      </DialogContent>
        {dialog === "store" &&
          <DialogToStore 
            book={book}
            onClose={(b: Boolean = false) => databaseUpdated(b)}
          /> 
        }
        {dialog === "read" &&
          <DialogToRead
            book={book}
            onClose={(b: Boolean = false) => databaseUpdated(b)}
          /> 
        }
        {dialog === "delete" &&
          <DialogToDelete 
            book={book}
            onClose={(b: Boolean = false) => databaseUpdated(b)}
          />
        }
    </Dialog>
  );
}