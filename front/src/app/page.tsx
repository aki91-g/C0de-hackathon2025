import Graph from "./_components/Graph";
import BookMenu from "./_components/BookMenu";
import FabMenu from "./_components/CameraButton";
import type { Book } from "@/types/book";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

async function getSortedStore(): Promise<Book[]> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/books/store`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return (await response.json()) as Book[];
  } catch {
    return [];
  }
}

async function getSortedReserve(): Promise<Book[]> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/books/reserve`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return (await response.json()) as Book[];
  } catch {
    return [];
  }
}

async function getSortedRead(): Promise<Book[]> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/books/read`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return (await response.json()) as Book[];
  } catch {
    return [];
  }
}

type GraphValue = {
  date: string;
  value: number;
};

async function getStores(): Promise<GraphValue[]> {
  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}/status/graph/accumulative_store/7`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return (await response.json()) as GraphValue[];
  } catch {
    return [];
  }
}

async function getNewStores(): Promise<GraphValue[]> {
  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}/status/graph/ondate_store/7`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return (await response.json()) as GraphValue[];
  } catch {
    return [];
  }
}

async function getNewReads(): Promise<GraphValue[]> {
  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}/status/graph/ondate_read/7`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return (await response.json()) as GraphValue[];
  } catch {
    return [];
  }
}

async function getCosts(): Promise<number> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/status/sum/store`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return (await response.json()) as number;
  } catch {
    return -1;
  }
}

export default async function Home() {
  const [
    storeBooks,
    reserveBooks,
    readBooks,
    stores,
    newStores,
    newReads,
    cost,
  ] = await Promise.all([
    getSortedStore(),
    getSortedReserve(),
    getSortedRead(),
    getStores(),
    getNewStores(),
    getNewReads(),
    getCosts(),
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col gap-10 py-20 px-8 text-black dark:text-zinc-50 sm:px-16">
        <FabMenu />

        <section className="space-y-6">
          <Graph
            values1={stores}
            values2={newStores}
            values3={newReads}
            cost={cost}
            reads={readBooks.length}
          />
          <BookMenu prop="store" books={storeBooks} />
          <BookMenu prop="reserve" books={reserveBooks} />
          <BookMenu prop="read" books={readBooks} />
        </section>
      </main>
    </div>
  );
}
