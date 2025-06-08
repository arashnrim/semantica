import type { ContentScriptContext } from "#imports";
import { type Article } from "@/types";
import { sendMessage } from "@/utils/messaging";
import { Readability } from "@mozilla/readability";

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

export default defineContentScript({
  matches: ["*://*/*"],
  main(context: ContentScriptContext) {
    // Clone required because Readability modifies the document
    var clone = document.cloneNode(true) as Document;

    // Uses Readability to parse and extract the main content from the page
    var reader = new Readability(clone);
    var article: null | Article = reader.parse();

    if (article) {
      sendMessage("processArticle", article);
    }
  },
});
