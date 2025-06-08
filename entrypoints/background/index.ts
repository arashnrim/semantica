import { type Article, OllamaResponse } from "@/types";
import { onMessage } from "@/utils/messaging";
import { formatPrompt, systemPrompt } from "@/utils/prompt";
import ollama from "ollama/browser";
import { z } from "zod/v4";

const processArticle = async (article: Article) => {
  const modelFamily = "qwen3";
  const jsonSchema = z.toJSONSchema(OllamaResponse);

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

  const data: OllamaResponse = JSON.parse(apiResponse.response);
  return data;
};

export default defineBackground(() => {
  var href: string | undefined;
  var articleResponse: OllamaResponse | undefined;

  onMessage("processArticle", async (message) => {
    try {
      const response = await processArticle(message.data);
      articleResponse = response;
      console.log(articleResponse);
      sendMessage("articleProcessed", articleResponse);
    } catch (error) {
      console.error("Error processing article:", error);
      throw error;
    }
  });

  onMessage("popupOpened", (currentHref) => {
    if (href != currentHref.data) {
      href = currentHref.data;
    } else if (articleResponse) {
      // If the popup is opened again with the same URL, send the cached response
      sendMessage("articleProcessed", articleResponse);
    }
  });
});
