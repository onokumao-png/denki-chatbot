"use client";

import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  disabled: boolean;
};

export function InputBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t bg-white">
      <input
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="例：OCRの整定値の決め方は？"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        送信
      </button>
    </form>
  );
}
