import { Readability } from "@mozilla/readability";
import { z } from "zod/v4";

const AnalysisSchema = z.object({
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

export { AnalysisSchema };
export type Analysis = z.infer<typeof AnalysisSchema>;
export type OllamaResponse = z.infer<typeof AnalysisSchema>;
export type Article = NonNullable<ReturnType<Readability<string>["parse"]>>;
