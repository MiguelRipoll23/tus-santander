import { z } from "zod";
import type { TusApiResponse } from "../interfaces/adapters/tus-api-response.ts";

export const TusApiResponseSchema: z.ZodType<TusApiResponse> = z.array(
  z.object({
    line: z.number(),
    estimations: z.array(
      z.object({
        destination: z.string(),
        remainingTime: z.number(),
      })
    ),
  })
);
