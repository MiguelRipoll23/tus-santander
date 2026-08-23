import { injectable } from "@needle-di/core";
import { z } from "zod";
import { SortOrder } from "../../../enums/sort-order-enum.ts";
import {
  McpPromptDefinition,
  McpPromptRunResult,
} from "../../../interfaces/mcp/mcp-prompt-interface.ts";

const GetEstimationsPromptSchema = z.object({
  stopName: z
    .string()
    .min(1)
    .max(150)
    .describe(
      "The name or partial name of the stop to search for, e.g., 'Ayuntamiento', 'Pereda'"
    ),
  sortOrder: z.nativeEnum(SortOrder).optional(),
  summaryFocus: z.string().min(1).max(512).optional(),
});

type GetEstimationsPromptInput = z.infer<typeof GetEstimationsPromptSchema>;

@injectable()
export class EstimationsPromptService {
  public getDefinition(): McpPromptDefinition {
    return {
      name: "get_estimations_summary",
      meta: {
        title: "Get estimations and summarize",
        description:
          "Search for stops by name and retrieve real-time arrival estimations, then provide a summary of the results",
        argsSchema: GetEstimationsPromptSchema,
      },
      run: (input: unknown): McpPromptRunResult => {
        const parsed = GetEstimationsPromptSchema.parse(input);
        const payload = this.buildPayload(parsed);
        const summaryFocus = parsed.summaryFocus?.trim().length
          ? parsed.summaryFocus.trim()
          : "Summarize the first estimated arrival time for the first matching stop and line..";

        const jsonPayload = JSON.stringify(payload, null, 2);

        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: [
                  "Use the stops.get_estimations tool with the following input:",
                  jsonPayload,
                  "",
                  `After reviewing the tool response, ${summaryFocus}`,
                  "Return only the first ETA for the first matching stop and line.",
                ].join("\n"),
              },
            },
          ],
        } satisfies McpPromptRunResult;
      },
    } satisfies McpPromptDefinition;
  }

  private buildPayload(
    input: GetEstimationsPromptInput
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      stopName: input.stopName,
    };

    if (input.sortOrder) {
      payload.sortOrder = input.sortOrder;
    }

    // Pagination removed: do not include limit or cursor

    return payload;
  }
}
