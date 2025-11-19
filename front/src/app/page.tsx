import Graph from "./_components/Graph"
import BookMenu from "./_components/BookMenu"
import FabMenu from "./_components/CameraButton";
import type { Book } from "@/types/book";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

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

      </main>
    </div>
  );
}
