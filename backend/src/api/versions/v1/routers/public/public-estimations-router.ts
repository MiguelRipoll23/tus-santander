import { inject, injectable } from "@needle-di/core";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { EstimationsService } from "../../services/estimations/estimations-service.ts";
import { ServerResponse } from "../../models/server-response.ts";
import {
  GetEstimationsResponseSchema,
  GetCompactEstimationsResponseSchema,
  GetEstimationsRequestSchema,
  GetCompactEstimationsRequestSchema,
} from "../../schemas/estimations-schemas.ts";

@injectable()
export class PublicEstimationsRouter {
  private app: OpenAPIHono;

  constructor(private estimationsService = inject(EstimationsService)) {
    this.app = new OpenAPIHono();
    this.setRoutes();
  }

  public getRouter(): OpenAPIHono {
    return this.app;
  }

  private setRoutes(): void {
    this.registerGetFullRoute();
    this.registerGetCompactRoute();
  }

  private registerGetFullRoute(): void {
    this.app.openapi(
      createRoute({
        method: "post",
        path: "/get",
        summary: "Get estimations",
        description:
          "Returns real-time estimations for a specific stop, with optional filtering by line label and destination.",
        tags: ["Estimations"],
        request: {
          body: {
            content: {
              "application/json": {
                schema: GetEstimationsRequestSchema,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Estimations retrieved",
            content: {
              "application/json": {
                schema: GetEstimationsResponseSchema,
              },
            },
          },
          ...ServerResponse.BadRequest,
          ...ServerResponse.ServiceUnavailable,
        },
      }),
      async (context: Context) => {
        const body = GetEstimationsRequestSchema.parse(
          await context.req.json()
        );
        const result = await this.estimationsService.getFull(body);
        return context.json(result, 200);
      }
    );
  }

  private registerGetCompactRoute(): void {
    this.app.openapi(
      createRoute({
        method: "post",
        path: "/get-compact",
        summary: "Get compact estimations",
        description:
          "Returns real-time compact estimations for a specific stop in a compact format.",
        tags: ["Estimations"],
        request: {
          body: {
            content: {
              "application/json": {
                schema: GetCompactEstimationsRequestSchema,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Compact estimations retrieved",
            content: {
              "application/json": {
                schema: GetCompactEstimationsResponseSchema,
              },
            },
          },
          ...ServerResponse.BadRequest,
          ...ServerResponse.ServiceUnavailable,
        },
      }),
      async (context: Context) => {
        const body = GetCompactEstimationsRequestSchema.parse(
          await context.req.json()
        );
        const result = await this.estimationsService.getCompact(body);
        return context.json(result, 200);
      }
    );
  }
}
