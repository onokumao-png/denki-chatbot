import { anthropic } from "@/lib/claude";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { NextRequest } from "next/server";

// レート制限：同一IPからのリクエスト間隔（ミリ秒）
const RATE_LIMIT_MS = 3000;
const lastRequestTime = new Map<string, number>();

// メッセージ1件の最大文字数・会話の最大ターン数
const MAX_CONTENT_LENGTH = 2000;
const MAX_MESSAGES = 40;

type Message = { role: "user" | "assistant"; content: string };

function validateMessages(raw: unknown): Message[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  if (raw.length > MAX_MESSAGES) return null;
  for (const msg of raw) {
    if (typeof msg !== "object" || msg === null) return null;
    const { role, content } = msg as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length === 0) return null;
    if (content.length > MAX_CONTENT_LENGTH) return null;
  }
  return raw as Message[];
}

export async function POST(req: NextRequest) {
  // レート制限チェック
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const last = lastRequestTime.get(ip) ?? 0;
  if (now - last < RATE_LIMIT_MS) {
    return new Response("Too many requests", { status: 429 });
  }
  lastRequestTime.set(ip, now);

  // リクエストボディの JSON パース
  let messages: Message[];
  try {
    const body = await req.json();
    const validated = validateMessages(body.messages);
    if (!validated) {
      return new Response("Invalid messages format", { status: 400 });
    }
    messages = validated;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Claude API へストリーミングリクエストを送信
  let stream;
  try {
    stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });
  } catch (error) {
    console.error("Anthropic API error:", error);
    return new Response("AI service unavailable", { status: 503 });
  }

  // ReadableStream に変換してクライアントへ返す
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
