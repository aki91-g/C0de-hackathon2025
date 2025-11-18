"use client";

import { useEffect, useRef, useState } from "react";

export default function AutoFitText({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16); // 初期フォントサイズ

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const MAX = 16;
    const MIN = 10;
    let size = MAX;

    // コンテナに収まるまでフォントサイズを下げる
    while (size >= MIN) {
      el.style.fontSize = size + "px";

      const overflow =
        el.scrollHeight > el.clientHeight ||
        el.scrollWidth > el.clientWidth;

      if (!overflow) break;

      size--;
    }

    setFontSize(size);
  }, [text]);

  return (
    <div
      className="h-20 w-full overflow-hidden flex items-center"
      style={{ fontSize }}
      ref={ref}
    >
      {text}
    </div>
  );
}