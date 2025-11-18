// import BookSearchForm from "./_components/book-search-form";
import Graph from "./_components/Graph"
import BookMenu from "./_components/BookMenu"
import BarcodeReader from "./_components/BarcodeReader";
import FabMenu from "./_components/CameraButton";
import type { Book } from "@/types/book";

// type GreetingResponse = {
//   message: string;
//   timestamp: string;
// };

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

// async function getGreeting(): Promise<GreetingResponse> {
//   try {
//     const response = await fetch(`${BACKEND_BASE_URL}/api/greeting`, {
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       throw new Error(`Backend responded with ${response.status}`);
//     }

//     return (await response.json()) as GreetingResponse;
//   } catch {
//     return {
//       message: "Backend APIに接続できませんでした。",
//       timestamp: new Date().toISOString(),
//     };
//   }
// }

async function getBooks(): Promise<Book[]> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/books/`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return (await response.json()) as Book[]
  } catch {
    return [];
  }
}

export default async function Home() {
  // const greeting = await getGreeting();
  const books = await getBooks();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col gap-10 py-20 px-8 text-black dark:text-zinc-50 sm:px-16">
        <FabMenu />
        
        <section className="space-y-6">
          <Graph />
          <BookMenu prop="store" books={books} />
          <BookMenu prop="reserve" books={books}/>
          <BookMenu prop="read" books={books}/>
        </section>
        <section className="space-y-6">
          <BarcodeReader/>
        </section>

        {/* <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
            最新のバックエンドレスポンス
          </h2>
          <p className="mt-4 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            {greeting.message}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            受信時刻: {new Date(greeting.timestamp).toLocaleString()}
          </p>
        </section>

        <BookSearchForm backendBaseUrl={BACKEND_BASE_URL} />

        <section className="flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            1. `python back/main.py` で FastAPI サーバー (デフォルト:{" "}
            <code className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-50">
              http://127.0.0.1:8000
            </code>
            ) を起動
          </p>
          <p>2. `cd front && npm run dev` でフロントエンドを起動</p>
          <p>3. ブラウザで http://localhost:3000 を開いて動作確認</p>
        </section> */}
      </main>
    </div>
  );
}
