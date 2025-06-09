import type { Article, Analysis } from "@/types";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  processArticle(data: { url: string; article: Article }): void;
  articleProcessed: { url: string; analysis: Analysis };
  popupOpened(url: string): void;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
