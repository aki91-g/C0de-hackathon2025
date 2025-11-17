import BarcodeReader from "../_components/BarcodeReader";

export default async function ShootInStore() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col gap-10 py-20 px-8 text-black dark:text-zinc-50 sm:px-16">
            <h1 className="text-center text-lg font-bold">バーコードを読み取らせてください。</h1>
            <BarcodeReader/>
        </main>
        </div>
    );
}