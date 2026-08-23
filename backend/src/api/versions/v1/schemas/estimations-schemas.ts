import { z } from "zod";

export const GetEstimationsRequestSchema = z.object({
  stopId: z
    .number()
    .int()
    .describe("Identifier of the stop")
    .openapi({ example: 41 }),
  lineLabel: z
    .string()
    .min(1)
    .max(5)
    .optional()
    .describe("Label of the line to filter estimations")
    .openapi({ example: "LC" }),
  refresh: z
    .boolean()
    .optional()
    .describe("Refresh flag to reduce data sent by the server")
    .openapi({ example: false }),
});

export type GetEstimationsRequest = z.infer<typeof GetEstimationsRequestSchema>;

export const ArrivalTimesSchema = z
  .object({
    next: z.number().int().nullable().describe("Minutes until next arrival"),
    following: z
      .number()
      .int()
      .nullable()
      .describe("Minutes until the following arrival"),
  })
  .openapi({
    example: { next: 3, following: 20 },
  });

export const LineEstimationSchema = z
  .object({
    label: z.string().min(1).max(5).describe("Line label"),
    destination: z.string().min(1).max(150).describe("Line destination"),
    arrivals: ArrivalTimesSchema,
    upcomingStops: z
      .array(z.string())
      .optional()
      .describe("List of upcoming stops for this line"),
  })
  .openapi({
    example: {
      label: "LC",
      destination: "INT. AVDA. VALDECILLA",
      arrivals: { next: 3, following: 20 },
      upcomingStops: ["SAN FERNANDO 22", "INTERCAMBIADOR AVENIDA VALDECILLA"],
    },
  });

export const GetEstimationsResponseSchema = z
  .object({
    activeLines: z
      .array(LineEstimationSchema)
      .describe("Currently active line estimations for this stop"),
    allLineLabels: z
      .array(z.string())
      .optional()
      .describe(
        "All line labels that exist at this stop, including inactive ones"
      ),
  })
  .openapi({
    example: {
      activeLines: [
        {
          label: "LC",
          destination: "INT. AVDA. VALDECILLA",
          arrivals: { next: 3, following: 20 },
          upcomingStops: [
            "SAN FERNANDO 22",
            "INTERCAMBIADOR AVENIDA VALDECILLA",
          ],
        },
      ],
      allLineLabels: [
        "1",
        "2",
        "11",
        "12",
        "13",
        "17",
        "18",
        "LC",
        "N1",
        "N2",
        "N3",
        "E31",
        "E1",
        "E7",
        "7C1",
      ],
    },
  });

export type GetEstimationsResponse = z.infer<
  typeof GetEstimationsResponseSchema
>;

export const GetCompactEstimationsRequestSchema = z.object({
  stopId: z
    .number()
    .int()
    .describe("Identifier of the stop")
    .openapi({ example: 41 }),
  lineLabel: z
    .string()
    .min(1)
    .max(5)
    .optional()
    .describe("Label of the line to filter estimations")
    .openapi({ example: "LC" }),
  refresh: z
    .boolean()
    .optional()
    .describe("Refresh flag to reduce data sent by the server")
    .openapi({ example: false }),
});

export type GetCompactEstimationsRequest = z.infer<
  typeof GetCompactEstimationsRequestSchema
>;

export const CompactLineEstimationsSchema = z.tuple([
  z.string().max(5).openapi({ example: "LC" }),
  z.string().max(150).openapi({ example: "INT. AVDA. VALDECILLA" }),
  z.number().int().openapi({ example: 12 }),
  z.number().int().openapi({ example: 27 }),
]);

export const GetCompactEstimationsResponseSchema = z
  .tuple([
    z
      .array(CompactLineEstimationsSchema)
      .describe("List of compact line estimations"),
    z
      .array(z.string())
      .nullable()
      .describe(
        "When lineLabel is provided: upcoming stops for that line. When lineLabel is not provided: all line labels used by the stop. Null if refresh is true"
      ),
  ])
  .openapi({
    example: [
      [
        ["13", "LLUJA", 2, 30],
        ["1", "ADARZO", 3, 13],
      ],
      ["1", "2", "11", "12", "13", "17", "18", "LC"],
    ],
  });

export type GetCompactEstimationsResponse = z.infer<
  typeof GetCompactEstimationsResponseSchema
>;
