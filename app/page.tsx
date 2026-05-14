"use client";

import { useState } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { InputBar } from "@/components/InputBar";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  async function handleSend(text: string) {
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(newMessages);
    setIsStreaming(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("API エラー");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // ストリーム終了時にバッファ内の残りバイト（日本語マルチバイト文字等）をフラッシュ
          accumulated += decoder.decode();
          break;
        }
        accumulated += decoder.decode(value, { stream: true });
        setStreamingText(accumulated);
      }

      setMessages([
        ...newMessages,
        { role: "assistant", content: accumulated },
      ]);
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "エラーが発生しました。もう一度お試しください。" },
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingText("");
    }
  }

  return (
    <div className="flex flex-col h-dvh max-w-2xl mx-auto bg-white shadow-sm">
      {/* ヘッダー */}
      <header className="flex items-center gap-2 p-4 border-b bg-blue-600 text-white">
        <span className="text-xl">⚡</span>
        <div>
          <h1 className="font-bold text-sm">電工AI技術相談</h1>
          <p className="text-xs opacity-80">現場の「あれなんだっけ？」を即解決</p>
        </div>
      </header>

      <ChatWindow
        messages={messages}
        isStreaming={isStreaming}
        streamingText={streamingText}
      />

      <InputBar onSend={handleSend} disabled={isStreaming} />

      {/* フッター */}
      <footer className="text-center text-xs text-gray-400 py-2">
        by LuminaTech 小野由晴
      </footer>
    </div>
  );
}
