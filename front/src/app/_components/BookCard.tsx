"use client"

import Image from "next/image";
import type { Book } from "@/types/book"
import { useState } from "react";

export default function BookCard({ book, onClick }: { book: Book, onClick: any }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="border rounded-lg p-3 shadow hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {!hasError ? 
        <Image src={book.cover_image_url} alt="image" width={200} height={200} onError={() => setHasError(true)} className="object-cover rounded"/>
         :
        <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-sm">
          NO IMAGE
        </div>
      }
      <div className="mt-2 text-center font-medium">{book.title}</div>
    </div>
  );
}