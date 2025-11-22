"use client";
import { useEffect, useState } from "react";

export default function Toast({
  message,
  duration = 1500,
}: {
  message: string;
  duration?: number;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className={`
        fixed inset-0 flex justify-center items-center pointer-events-none
        transition-opacity duration-500
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div className="bg-black text-white px-6 py-3 rounded-lg shadow-lg">
        {message}
      </div>
    </div>
  );
}
