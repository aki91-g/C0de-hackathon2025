"use client";
import { useState } from "react";
import type { Book } from "@/types/book";
import { useRouter } from "next/navigation";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

export default function NumberInput({ book }: { book: Book }) {
  const [value, setValue] = useState(book.cost.toString());
  const router = useRouter();

  async function patchCost(cost: number): Promise<Book> {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/books/${book.id}/cost`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cost }),
        },
      );

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }
      router.refresh();
      return (await response.json()) as Book;
    } catch {
      return {
        title: "",
        author: "",
        isbn: "",
        cover_image_url: "",
        cost: 0,
        description: "Error",
        status: "",
        last_modified: "",
        status_reserve_at: "",
        status_store_at: "",
        status_read_at: "",
        id: -1,
      };
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, "");
    setValue(numeric);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={() => patchCost(Number(value))}
      onKeyDown={(e) => e.key === "Enter" && patchCost(Number(value))}
      className="border p-2 rounded text-right w-2/3"
      placeholder="数字を入力"
    />
  );
}
