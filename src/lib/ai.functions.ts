import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)("google/gemini-3-flash-preview");
}

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().trim().min(3).max(2000),
      depth: z.enum(["quick", "standard", "deep"]).default("standard"),
    }),
  )
  .handler(async ({ data }) => {
    const depthGuide = {
      quick: "Keep it under 200 words.",
      standard: "Aim for around 400 words.",
      deep: "Provide a thorough analysis around 700 words.",
    }[data.depth];

    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an AI research assistant for busy professionals. Produce well-structured markdown briefings with these sections: ## Summary, ## Key Insights (bulleted), ## Recommendations (actionable bullets), ## Things to Verify. Be neutral, evidence-aware, and call out uncertainty. Never fabricate sources or statistics.",
      prompt: `Research topic: ${data.topic}\n\n${depthGuide}`,
    });

    return { content: text };
  });

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      purpose: z.string().trim().min(5).max(2000),
      recipient: z.string().trim().max(200).optional().default(""),
      tone: z.enum(["formal", "friendly", "persuasive", "apologetic", "concise"]),
      length: z.enum(["short", "medium", "long"]).default("medium"),
    }),
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an expert professional email writer. Output ONLY the email — start with 'Subject: <subject line>' on the first line, then a blank line, then the email body with a greeting, body paragraphs, and a sign-off using [Your Name]. Do not include any preamble, explanation, or commentary. Use clear, natural language. Match the requested tone precisely.",
      prompt: `Recipient: ${data.recipient || "(unspecified)"}\nTone: ${data.tone}\nLength: ${data.length}\nPurpose / context:\n${data.purpose}`,
    });

    return { content: text };
  });
