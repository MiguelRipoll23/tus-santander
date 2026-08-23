import { z } from "zod";

export const GetRouteRequestSchema = z.object({
  stopId: z
    .number()
    .int()
    .describe("Identifier of the stop")
    .openapi({ example: 41 }),
  lineLabel: z
    .string()
    .min(1)
    .max(5)
    .describe("Label of the line")
    .openapi({ example: "LC" }),
});

export type GetRouteRequest = z.infer<typeof GetRouteRequestSchema>;

export const GetRouteResponseSchema = z.array(
  z.object({
    stopId: z
      .number()
      .int()
      .describe("Identifier of the stop")
      .openapi({ example: 41 }),
    stopName: z
      .string()
      .min(1)
      .max(150)
      .describe("Name of the stop")
      .openapi({ example: "SAN FERNANDO 22" }),
    stopLines: z
      .array(z.string())
      .optional()
      .describe("List of line labels for the stop")
      .openapi({ example: ["3", "4", "LC", "E31", "E1"] }),
  })
);

export type GetRouteResponse = z.infer<typeof GetRouteResponseSchema>;

export const GetCompactRouteRequestSchema = z.object({
  stopId: z
    .number()
    .int()
    .describe("Identifier of the stop")
    .openapi({ example: 41 }),
  lineLabel: z
    .string()
    .min(1)
    .max(5)
    .describe("Label of the line")
    .openapi({ example: "LC" }),
});

export type GetCompactRouteRequest = z.infer<
  typeof GetCompactRouteRequestSchema
>;

export const GetCompactRouteResponseSchema = z
  .array(
    z.tuple([
      z.number().int().describe("Identifier of the stop"),
      z.string().min(1).max(150).describe("Name of the stop"),
      z.array(z.string()).describe("List of line labels used by the stop"),
    ])
  )
  .openapi({
    example: [
      [516, "INTERCAMBIADOR SARDINERO", ["3", "4", "LC", "E31", "E1"]],
      [171, "ALCALDE VEGA LAMERA 1", ["LC", "24C1", "E31", "6C1"]],
      [41, "PLAZA AYUNTAMIENTO", ["1", "2", "11", "LC", "N1", "E31", "E1"]],
    ],
  });

export type GetCompactRouteResponse = z.infer<
  typeof GetCompactRouteResponseSchema
>;
