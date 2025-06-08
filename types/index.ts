import { Readability } from "@mozilla/readability";
import { z } from "zod/v4";

const OllamaResponseSchema = z.object({
  keyEntities: z.array(z.string()),
  phrases: z.array(
    z.object({
      label: z.string(),
      explanation: z.string(),
      phrase: z.string(),
    })
  ),
  opinion: z.string(),
});

export { OllamaResponseSchema as OllamaResponse };
export type OllamaResponse = z.infer<typeof OllamaResponseSchema>;
export type Article = NonNullable<ReturnType<Readability<string>["parse"]>>;
