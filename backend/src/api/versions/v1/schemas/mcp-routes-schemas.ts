import { z } from "zod";

export const GetRouteToolSchema = z.object({
  stopName: z
    .string()
    .min(1)
    .max(150)
    .describe("The name or partial name of the stop to search for (case insensitive)"),
  lineLabel: z
    .string()
    .min(1)
    .max(5)
    .describe("Label of the line to filter routes (case insensitive)"),
});

export const RouteToolStopSchema = z.object({
  stopId: z.number().int().describe("Unique stop identifier"),
  stopName: z.string().describe("Display name of the stop"),
  order: z.number().int().describe("Order of the stop in the route"),
});

export const GetRouteToolOutputSchema = z.object({
  matched: z.boolean().describe("Whether a stop matched the search"),
  stopId: z
    .number()
    .int()
    .nullable()
    .describe("Unique stop identifier used for route lookup, or null when no stop matched"),
  stopName: z
    .string()
    .nullable()
    .describe("Display name of the matched stop, or null when no stop matched"),
  lineLabel: z.string().describe("Label of the requested transit line"),
  totalStops: z.number().int().describe("Total number of stops in the route (zero when no stop matched)"),
  routeStops: z
    .array(RouteToolStopSchema)
    .describe("Stops in route order (empty when no stop matched)"),
});
