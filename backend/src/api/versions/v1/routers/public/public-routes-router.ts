import { inject, injectable } from "@needle-di/core";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { RoutesService } from "../../services/routes/routes-service.ts";
import { ServerResponse } from "../../models/server-response.ts";
import {
  GetRouteRequestSchema,
  GetCompactRouteRequestSchema,
  GetRouteResponseSchema,
  GetCompactRouteResponseSchema,
} from "../../schemas/routes-schemas.ts";

@injectable()
export class PublicRoutesRouter {
  private app: OpenAPIHono;

  constructor(private routesService = inject(RoutesService)) {
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
        summary: "Get routes",
        description:
          "Returns full route information for a specific stop, filtered by line label.",
        tags: ["Routes"],
        request: {
          body: {
            content: {
              "application/json": {
                schema: GetRouteRequestSchema,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Routes retrieved",
            content: {
              "application/json": {
                schema: GetRouteResponseSchema,
              },
            },
          },
          ...ServerResponse.BadRequest,
          ...ServerResponse.ServiceUnavailable,
        },
      }),
      async (context: Context) => {
        const body = GetRouteRequestSchema.parse(await context.req.json());
        const result = await this.routesService.getFull(body);
        return context.json(result, 200);
      }
    );
  }

  private registerGetCompactRoute(): void {
    this.app.openapi(
      createRoute({
        method: "post",
        path: "/get-compact",
        summary: "Get compact routes",
        description:
          "Returns route information in a compact format for a specific stop filtered by line label.",
        tags: ["Routes"],
        request: {
          body: {
            content: {
              "application/json": {
                schema: GetCompactRouteRequestSchema,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Compact routes retrieved",
            content: {
              "application/json": {
                schema: GetCompactRouteResponseSchema,
              },
            },
          },
          ...ServerResponse.BadRequest,
          ...ServerResponse.ServiceUnavailable,
        },
      }),
      async (context: Context) => {
        const body = GetCompactRouteRequestSchema.parse(
          await context.req.json()
        );
        const result = await this.routesService.getCompact(body);
        return context.json(result, 200);
      }
    );
  }
}
