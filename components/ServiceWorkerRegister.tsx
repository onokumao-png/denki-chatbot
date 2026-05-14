"use client";

import { useEffect } from "react";

// Service Worker をブラウザに登録する Client Component
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW 登録失敗はサイレントに無視（PWA 機能なしで動作継続）
      });
    }
  }, []);

  return null;
}
