"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  messages: Message[];
  isStreaming: boolean;
  streamingText: string;
};

export function ChatWindow({ messages, isStreaming, streamingText }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが来たら自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-16 text-sm">
          <div className="text-4xl mb-3">⚡</div>
          <p>現場の「あれなんだっけ？」を即解決</p>
          <p className="mt-1">OCR・GR・VCB・保護協調など何でも聞いてください</p>
        </div>
      )}
      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} content={msg.content} />
      ))}
      {isStreaming && streamingText && (
        <MessageBubble role="assistant" content={streamingText + "▌"} />
      )}
      <div ref={bottomRef} />
    </div>
  );
}
