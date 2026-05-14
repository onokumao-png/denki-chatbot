import Anthropic from "@anthropic-ai/sdk";

// Anthropic クライアントをシングルトンで初期化
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
