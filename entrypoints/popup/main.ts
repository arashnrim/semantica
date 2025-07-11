import type { Analysis } from "@/types";
import { onMessage } from "@/utils/messaging";
import { browser } from "wxt/browser";
import "./style.css";

var generalAnalysis = document.querySelector("#general-analysis");
var languageUsage = document.querySelector("#language-usage");
var currentTabUrl: string | undefined;

browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  currentTabUrl = tabs[0].url;
  sendMessage("popupOpened", tabs[0].url ?? "");
});

onMessage("articleProcessed", (data) => {
  console.log("[SEMANTICA] ", data.data.url, " ", currentTabUrl);
  if (data.data.url != currentTabUrl) return;

  const analysis = data.data.analysis as Analysis;

  const generalParagraph =
    generalAnalysis?.querySelector<HTMLParagraphElement>("p");
  if (generalParagraph && analysis.opinion) {
    generalParagraph.textContent = analysis.opinion;
  }

  document.querySelector<HTMLParagraphElement>("#response")!.textContent =
    JSON.stringify(data, null, 2);
});

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
