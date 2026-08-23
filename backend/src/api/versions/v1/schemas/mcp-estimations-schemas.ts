import { z } from "zod";

export const GetEstimationsToolSchema = z.object({
  stopName: z
    .string()
    .min(1)
    .max(150)
    .describe("Name or partial name of the stop to search for (case insensitive)"),
  lineLabel: z
    .string()
    .min(1)
    .max(5)
    .optional()
    .describe("Label of the line to filter lines (case insensitive). If omitted, estimations for all lines at the stop will be retrieved"),
});

export const EstimationLineSchema = z.object({
  label: z.string().describe("Transit line label"),
  destination: z.string().describe("Destination name"),
  arrivals: z.object({
    next: z.number().nullable().describe("Minutes until next arrival"),
    following: z.number().nullable().describe("Minutes until following arrival"),
  }),
});

export const GetEstimationsToolOutputSchema = z.object({
  matched: z.boolean().describe("Whether a stop matched the search"),
  requestedStopName: z.string().describe("Original stop search text used for this lookup"),
  requestedLineLabel: z
    .string()
    .nullable()
    .describe("Original line label filter used for this lookup, or null when no filter was provided"),
  stopId: z
    .number()
    .int()
    .nullable()
    .describe("Unique stop identifier, or null when no stop matched"),
  stopName: z
    .string()
    .nullable()
    .describe("Matched stop name, or null when no stop matched"),
  activeLines: z
    .array(EstimationLineSchema)
    .describe("List of active lines with arrival estimates (empty when no stop matched)"),
});

export const RenderEstimationsToolSchema = GetEstimationsToolSchema;
export const RenderEstimationsToolOutputSchema = GetEstimationsToolOutputSchema;
