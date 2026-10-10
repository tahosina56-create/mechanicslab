import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai/run-id.server";

const INSTRUCTIONS = `You are a SolidWorks troubleshooting assistant for mechanical engineering students.
Diagnose errors such as over-defined sketches, broken/failed mates, rebuild errors, dangling references, zero-thickness geometry, and failed fillets.
Answer with: a short likely cause, then numbered fix steps naming exact SolidWorks menus/tools (e.g. SketchXpert, MateXpert, What's Wrong, Display/Delete Relations), then one prevention tip. Use markdown. Be concise.`;

export const Route = createFileRoute("/api/cad-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("AI is not configured.", { status: 500 });
        const { messages } = (await request.json()) as { messages: UIMessage[] };
        const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          instructions: INSTRUCTIONS,
          messages: await convertToModelMessages(messages),
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            },
          },
        });
        return withLovableAiGatewayRunIdHeader(
          result.toUIMessageStreamResponse({
            originalMessages: messages,
            onError: (e) => {
              const s = (e as { statusCode?: number })?.statusCode;
              if (s === 429) return "Too many requests — please wait a moment and try again.";
              if (s === 402) return "AI credits are used up. Add credits in Settings → Plans & credits.";
              return "The assistant couldn't answer right now. Please try again.";
            },
          }),
          runIdFetch,
        );
      },
    },
  },
});
