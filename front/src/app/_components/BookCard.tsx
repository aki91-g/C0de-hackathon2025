export default function BookCard({ book, onClick }: any) {
  return (
    <div
      className="border rounded-lg p-3 shadow hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-sm">
        {book.image}
      </div>
      <div className="mt-2 text-center font-medium">{book.title}</div>
    </div>
  );
}