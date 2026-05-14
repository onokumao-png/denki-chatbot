import { anthropic } from "@/lib/claude";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // リクエストボディの JSON パース（不正な場合は 400 を返す）
  let messages: unknown[];
  try {
    const body = await req.json();
    messages = body.messages;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // messages の基本バリデーション
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("messages must be a non-empty array", { status: 400 });
  }

  // Claude API へストリーミングリクエストを送信
  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: messages as Array<{ role: "user" | "assistant"; content: string }>,
  });

  // ReadableStream に変換してクライアントへ返す
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        // ストリーム内のテキスト内容を読み込み、クライアントへ送信
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            // テキストデルタをエンコードしてコントローラーに追加
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        // ストリーム終了時にコントローラーをクローズ
        controller.close();
      } catch (error) {
        // ストリーム中のエラーをクライアントに伝播する
        controller.error(error);
      }
    },
  });

  // ストリーミングレスポンスをクライアントに返す
  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
