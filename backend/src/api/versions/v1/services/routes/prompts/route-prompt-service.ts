import { injectable } from "@needle-di/core";
import { z } from "zod";
import {
  McpPromptDefinition,
  McpPromptRunResult,
} from "../../../interfaces/mcp/mcp-prompt-interface.ts";

const RoutePromptSchema = z.object({
  stopName: z
    .string()
    .min(1)
    .max(150)
    .describe(
      "The name or partial name of the stop to search for, e.g., 'Ayuntamiento', 'Pereda'"
    ),
  lineLabel: z
    .string()
    .min(1)
    .max(5)
    .describe("Label of the line to filter routes, e.g., 'LC', '1', '13'"),
  summaryFocus: z.string().min(1).max(512).optional(),
});

type RoutePromptInput = z.infer<typeof RoutePromptSchema>;

@injectable()
export class RoutePromptService {
  public getDefinition(): McpPromptDefinition {
    return {
      name: "get_route_summary",
      meta: {
        title: "Get route and summarize",
        description:
          "Search for stops by name and retrieve route information for a specific line, then provide a summary of the results",
        argsSchema: RoutePromptSchema,
      },
      run: (input: unknown): McpPromptRunResult => {
        const parsed = RoutePromptSchema.parse(input);
        const payload = this.buildPayload(parsed);
        const summaryFocus = parsed.summaryFocus?.trim().length
          ? parsed.summaryFocus.trim()
          : "Provide a concise summary that highlights the matching stops, the route path, number of stops, and any notable destinations or connections.";

        const jsonPayload = JSON.stringify(payload, null, 2);

        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: [
                  "Use the get_route tool with the following input:",
                  jsonPayload,
                  "",
                  `After reviewing the tool response, ${summaryFocus}`,
                ].join("\n"),
              },
            },
          ],
        } satisfies McpPromptRunResult;
      },
    } satisfies McpPromptDefinition;
  }

  private buildPayload(input: RoutePromptInput): Record<string, unknown> {
    return {
      stopName: input.stopName,
      lineLabel: input.lineLabel,
    };
  }
}
