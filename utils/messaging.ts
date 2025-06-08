import type { Article, OllamaResponse } from "@/types";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  processArticle(data: Article): void;
  articleProcessed: OllamaResponse;
  popupOpened(url: string): void;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
