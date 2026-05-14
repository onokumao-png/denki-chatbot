import { anthropic } from "@/lib/claude";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  // リクエストボディから messages を取得
  const { messages } = await req.json();

  // Claude API へストリーミングリクエストを送信
  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  // ReadableStream に変換してクライアントへ返す
  const readableStream = new ReadableStream({
    async start(controller) {
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
