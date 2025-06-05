import type { Article, OllamaResponse } from "@/types";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  processArticle(data: Article): OllamaResponse;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
