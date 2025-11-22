"use client";

import Image from "next/image";
import type { Book } from "@/types/book";
import { useState } from "react";
import AutoFitText from "./AutoFitText";

export default function BookCard({
  book,
  onClick,
}: {
  book: Book;
  onClick: any;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="border rounded-lg p-3 shadow hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {book.cover_image_url && !hasError ? (
        <div className="w-full h-40 flex items-center justify-center">
          <Image
            src={book.cover_image_url}
            alt="image"
            width={800}
            height={800}
            onError={() => setHasError(true)}
            className="object-contain max-h-40 rounded"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-sm">
          NO IMAGE
        </div>
      )}
      <AutoFitText text={book.title} />
    </div>
  );
}
