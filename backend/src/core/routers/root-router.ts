import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { injectable } from "@needle-di/core";

@injectable()
export class RootRouter {
  private app: OpenAPIHono;

  constructor() {
    this.app = new OpenAPIHono();
    this.setRoutes();
  }

  public getRouter(): OpenAPIHono {
    return this.app;
  }

  private setRoutes(): void {
    this.registerHealthRoute();
  }

  private registerHealthRoute(): void {
    this.app.openapi(
      createRoute({
        method: "get",
        path: "/health",
        summary: "Get health",
        description: "Obtains health status for the finance server",
        tags: ["Default"],
        responses: {
          204: {
            description: "Responds with no content",
          },
        },
      }),
      (c) => {
        return c.body(null, 204);
      }
    );
  }
}
