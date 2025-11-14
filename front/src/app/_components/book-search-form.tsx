"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";

type BookInfo = {
  isbn: string;
  title: string;
  authors: string[];
  publisher?: string | null;
  published_year?: string | null;
  description?: string | null;
  page_count?: number | null;
  thumbnail?: string | null;
  info_link?: string | null;
};

type BookSearchResponse = {
  found: boolean;
  message: string;
  book: BookInfo | null;
};

type Props = {
  backendBaseUrl: string;
};

export default function BookSearchForm({ backendBaseUrl }: Props) {
  const [isbn, setIsbn] = useState("");
  const [result, setResult] = useState<BookSearchResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const response = await fetch(`${backendBaseUrl}/api/books/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isbn }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const payload = (await response.json()) as BookSearchResponse;
      setResult(payload);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "検索中にエラーが発生しました。サーバーを確認してください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
        ISBN検索デモ
      </h2>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          ISBNを入力してください
          <input
            className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            type="text"
            placeholder="例: 978-4-16-411080-7"
            value={isbn}
            onChange={(event) => setIsbn(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </label>
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-xl bg-emerald-600 py-3 text-base font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "検索中..." : "このISBNで検索"}
        </button>
      </form>

      <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        <p>試せるISBN（Google Books APIで検索）:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>978-4-16-758312-8（成瀬は天下を取りにいく）</li>
          <li>978-4-04-102622-5（夜は短し歩けよ乙女）</li>
          <li>978-4-08-771112-1（かがみの孤城）</li>
        </ul>
      </div>

      <div className="mt-8">
        {errorMessage && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-900/20 dark:text-red-200">
            {errorMessage}
          </p>
        )}
        {result && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
            <p className="font-semibold">{result.message}</p>
            {result.book ? (
              <div className="mt-4 flex flex-col gap-6 sm:flex-row">
                {result.book.thumbnail && (
                  <div className="flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700">
                    <Image
                      src={result.book.thumbnail}
                      alt={`${result.book.title} の表紙`}
                      width={128}
                      height={192}
                      className="h-48 w-32 object-cover"
                      priority={false}
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3 text-sm">
                  <div>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {result.book.title}
                    </p>
                    {result.book.authors.length > 0 && (
                      <p className="text-zinc-500">
                        著者: {result.book.authors.join(" / ")}
                      </p>
                    )}
                  </div>

                  <dl className="space-y-1 text-zinc-500">
                    <div className="flex justify-between gap-4">
                      <dt>出版社</dt>
                      <dd className="text-right text-zinc-800 dark:text-zinc-200">
                        {result.book.publisher ?? "不明"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>出版年</dt>
                      <dd className="text-right text-zinc-800 dark:text-zinc-200">
                        {result.book.published_year ?? "不明"}
                      </dd>
                    </div>
                    {typeof result.book.page_count === "number" && (
                      <div className="flex justify-between gap-4">
                        <dt>ページ数</dt>
                        <dd className="text-right text-zinc-800 dark:text-zinc-200">
                          {result.book.page_count}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-4">
                      <dt>ISBN</dt>
                      <dd className="text-right text-zinc-800 dark:text-zinc-200">
                        {result.book.isbn}
                      </dd>
                    </div>
                  </dl>

                  {result.book.description && (
                    <p className="text-zinc-600 dark:text-zinc-300">
                      {result.book.description}
                    </p>
                  )}

                  {result.book.info_link && (
                    <a
                      className="inline-flex items-center gap-2 text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400"
                      href={result.book.info_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Google Booksで詳しく見る →
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                ISBNを確認して再度検索してください。
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
