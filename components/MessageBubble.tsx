import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        {isUser ? (
          content
        ) : (
          // アシスタントの回答はMarkdownをHTMLとしてレンダリング
          <ReactMarkdown remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              h1: ({ children }) => <h1 className="font-bold text-base mb-1">{children}</h1>,
              h2: ({ children }) => <h2 className="font-bold mb-1">{children}</h2>,
              h3: ({ children }) => <h3 className="font-semibold mb-1">{children}</h3>,
              table: ({ children }) => (
                <div className="overflow-x-auto mb-2">
                  <table className="text-xs border-collapse w-full">{children}</table>
                </div>
              ),
              th: ({ children }) => <th className="border border-gray-300 px-2 py-1 bg-gray-200 font-semibold">{children}</th>,
              td: ({ children }) => <td className="border border-gray-300 px-2 py-1">{children}</td>,
              hr: () => <hr className="my-2 border-gray-300" />,
              code: ({ children }) => <code className="bg-gray-200 px-1 rounded text-xs font-mono">{children}</code>,
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
