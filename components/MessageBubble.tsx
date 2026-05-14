// 1件のメッセージを表示するコンポーネント
type Props = {
  role: "user" | "assistant";
  content: string;
};

export function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm mr-2 shrink-0 mt-1">
          ⚡
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
