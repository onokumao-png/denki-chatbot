import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// APIキー未設定の場合は起動時に即エラーを出す
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  throw new Error("ANTHROPIC_API_KEY is not configured");
}

// Anthropic クライアントをシングルトンで初期化
export const anthropic = new Anthropic({ apiKey });
