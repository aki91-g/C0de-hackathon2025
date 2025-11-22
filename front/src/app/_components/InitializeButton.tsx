"use client";
import { useState } from "react";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

export default function InitializeButton() {
    const [value, setValue] = useState(false);

    async function initialize(): Promise<any> {
      setValue(true)
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/initialize`, {
          method: "POST",
        });
    
        if (!response.ok) {
          throw new Error(`Backend responded with ${response.status}`);
        }
    
        return (await response.json());
      } catch {
        return -1;
      }
    }
    return(
      <div>
      {value &&
        <button
        className="w-4 h-4 flex items-center justify-center rounded-full bg-white"
        ></button>
      }
      {!value &&
        <button
          onClick={() => initialize()}
          className="w-4 h-4 flex items-center justify-center rounded-full bg-black hover:bg-gray-800"
        ></button>
      }
      </div>
    )
}