import type { ContentScriptContext } from "#imports";
import { type Article, OllamaResponse } from "@/types";
import { Readability } from "@mozilla/readability";
import ollama from "ollama/browser";
import { z } from "zod/v4";

// TODO: Explore Hugging Face Transformers again
// const processArticleHF = async (article) => {
//   if (article) {
//     const systemPrompt = `You are part of a tool designed to evaluate news articles with a focus on the language and writing style employed by the author, excluding any direct quotes from sources. Your primary task is to return a JSON highlighting phrases that suggest, imply, or carry additional meaning beyond their literal wording such that they may introduce bias, manipulate reader perception, or present information in misleading ways. This includes, but is not limited to, emotive language, omitted context, priming techniques, selective emphasis, misleading or contextless data, narrative framing, and other rhetorical strategies.\n\nYou may think of yourself as a vigilant press editor tasked with scrutinizing editorial bias, subtle framing choices, and linguistic manipulation, even when they are disguised as objective reporting.\n\nYour response should only be in JSON. The JSON you return should follow this schema:\n\n{\n  \"phrases\": [\n    {\n      \"type\": string, // A concise, user-friendly label for the rhetorical device or strategy used (e.g., \"Loaded Language\", \"Priming\", \"Fallacy (Strawman)\")\n      \"explanation\": string, // A short, 1-2 sentence explanation of the phrase’s potential subtext or implications\n      \"phrase\": string // The exact phrase from the article to be highlighted\n    }\n  ],\n  \"opinion\": string // A reflective summary (up to five paragraphs) evaluating the language used in the article excerpt. Include anything the article does particularly well or poorly, patterns that suggest subtle bias, and any notable use of persuasive language.\n}\n\nPrioritize the following \"type\" labels when applicable:\n- \"Loaded language\"\n- \"Fallacy (XXX)\" – replace XXX with a specific fallacy, such as \"Ad hominem\", \"Strawman\", \"False dilemma\", etc.\n- \"Exaggeration\"\n- \"Priming\"\n- \"Selective emphasis\"\n- \"Context omission\"\n- \"Data without context\"\n- \"Vague attribution\"\n- \"Narrative framing\"\n\nYou may create new labels if none of the above fit, but they should remain intuitive and easily understandable by a general audience.\n\nThe following, wrapped between [START OF EXCERPT] and [END OF EXCERPT], is the article excerpt to evaluate:`;
//     const fullPrompt = `${systemPrompt}\n\n[START OF EXCERPT]\n${article.textContent}\n[END OF EXCERPT]`;

//     const pipe = await pipeline("text2text-generation", "google/gemma-3-4b-it");
//     const out = await pipe(fullPrompt);
//     console.log(out);
//   }
// };

const processArticle = async (article: Article) => {
  const systemPrompt = `You are part of a tool designed to evaluate news articles with a focus on the language and writing style employed by the author, excluding any direct quotes from sources. Your primary task is to return a JSON highlighting phrases that suggest, imply, or carry additional meaning beyond their literal wording such that they may introduce bias, manipulate reader perception, or present information in misleading ways. This includes, but is not limited to, emotive language, omitted context, priming techniques, selective emphasis, misleading or contextless data, narrative framing, and other rhetorical strategies.\n\nYou may think of yourself as a vigilant press editor tasked with scrutinizing editorial bias, subtle framing choices, and linguistic manipulation, even when they are disguised as objective reporting.\n\nYour response should only be in JSON. The JSON you return should follow this schema:\n\n{\n  \"phrases\": [\n    {\n      \"type\": string, // A concise, user-friendly label for the rhetorical device or strategy used (e.g., \"Loaded Language\", \"Priming\", \"Fallacy (Strawman)\")\n      \"explanation\": string, // A short, 1-2 sentence explanation of the phrase’s potential subtext or implications\n      \"phrase\": string // The exact phrase from the article to be highlighted\n    }\n  ],\n  \"opinion\": string // A reflective summary (up to five paragraphs) evaluating the language used in the article excerpt. Include anything the article does particularly well or poorly, patterns that suggest subtle bias, and any notable use of persuasive language.\n}\n\nIMPORTANT: Do not over-scrutinize. You are evaluating subtle rhetorical choices or suggestive framing, not simply any use of descriptive or subjective language. Avoid flagging harmless stylistic phrases unless they clearly push a specific perspective or interpretation. Use your judgment to distinguish between ordinary language and language that may meaningfully shift how the reader interprets the event. It is better to highlight fewer, more meaningful phrases than to include too many minor or debatable ones. Where the language is reasonably neutral or the rhetorical impact is unclear, give the benefit of the doubt and avoid flagging it. Only return phrases where you can confidently articulate the potential implication behind their use.\n\nIMPORTANT: Ignore direct quotes that are enclosed within quotation marks, either single (') or double (\"). You are only evaluating the language used by the author of the article, not the sources in which the article references.\n\nPrioritize the following \"type\" labels when applicable:\n- \"Loaded language\"\n- \"Fallacy (XXX)\" – replace XXX with a specific fallacy, such as \"Ad hominem\", \"Strawman\", \"False dilemma\", etc.\n- \"Exaggeration\"\n- \"Priming\"\n- \"Selective emphasis\"\n- \"Context omission\"\n- \"Data without context\"\n- \"Vague attribution\"\n- \"Narrative framing\"\n\nYou may create new labels if none of the above fit, but they should remain intuitive and easily understandable by a general audience.\n\nThe following, wrapped between [START OF EXCERPT] and [END OF EXCERPT], is the article excerpt to evaluate:`;
  const prompt = `[START OF EXCERPT]\n${article.textContent}\n[END OF EXCERPT]`;
  const fullPrompt = `${systemPrompt}\n\n${prompt}`;
  const jsonSchema = z.toJSONSchema(OllamaResponse);

  const modelFamily = "qwen3";
  // const response = await fetch(`http://localhost:11434/api/generate`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     model: modelFamily,
  //     prompt: fullPrompt,
  //     format: jsonSchema,
  //     stream: false,
  //   }),
  // });
  // const data: OllamaResponse = await response.json();

  const apiResponse = await ollama.generate({
    model: modelFamily,
    prompt: prompt,
    system: systemPrompt,
    format: jsonSchema,
    stream: false,
  });

  const data: OllamaResponse = JSON.parse(apiResponse.response);
  return data;
};

export default defineContentScript({
  matches: ["*://*/*"],
  main(context: ContentScriptContext) {
    // Clone required because Readability modifies the document
    var clone = document.cloneNode(true) as Document;

    // Uses Readability to parse and extract the main content from the page
    var reader = new Readability(clone);
    var article: null | Article = reader.parse();
    console.log(article);

    if (article) {
      // processArticleHF(article);
      processArticle(article).then((response) => {
        console.log(response);
      });
    }
  },
});
