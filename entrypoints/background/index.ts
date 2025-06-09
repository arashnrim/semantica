import { type Analysis, AnalysisSchema, type Article } from "@/types";
import { onMessage, sendMessage } from "@/utils/messaging";
import { formatPrompt, systemPrompt } from "@/utils/prompt";
import ollama from "ollama/browser";
import { z } from "zod/v4";

const processArticle = async (article: Article) => {
  const modelFamily = "qwen3";
  const jsonSchema = z.toJSONSchema(AnalysisSchema);

  const apiResponse = await ollama.generate({
    model: modelFamily,
    prompt: formatPrompt(article.textContent ?? ""),
    system: systemPrompt,
    format: jsonSchema,
    stream: false,
    options: {
      seed: 11434,
      temperature: 0.4,
      top_k: 40,
      top_p: 0.9,
    },
  });

  const data: Analysis = JSON.parse(apiResponse.response);
  return data;
};

export default defineBackground(() => {
  var analysesMap: Record<string, Analysis> = {};

  onMessage("processArticle", async (message) => {
    try {
      if (!analysesMap[message.data.url]) {
        const analysis = await processArticle(message.data.article);
        analysesMap[message.data.url] = analysis;
      }
    } catch (error) {
      console.error("Error processing article:", error);
      throw error;
    }
  });

  onMessage("popupOpened", (currentHref) => {
    if (currentHref.data in analysesMap) {
      // If the popup is opened with a URL that has already been processed, send the cached response
      sendMessage("articleProcessed", {
        url: currentHref.data,
        analysis: analysesMap[currentHref.data],
      });
    }
  });
});
