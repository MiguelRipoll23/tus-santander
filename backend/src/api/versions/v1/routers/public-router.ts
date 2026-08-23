import { OpenAPIHono } from "@hono/zod-openapi";
import { inject, injectable } from "@needle-di/core";
import { PublicEstimationsRouter } from "./public/public-estimations-router.ts";
import { PublicRoutesRouter } from "./public/public-routes-router.ts";
import { PublicMCPRouter } from "./public/public-mcp-router.ts";

@injectable()
export class V1PublicRouter {
  private app: OpenAPIHono;

  constructor(
    private mcpRouter = inject(PublicMCPRouter),
    private estimationsRouter = inject(PublicEstimationsRouter),
    private routesRouter = inject(PublicRoutesRouter)
  ) {
    this.app = new OpenAPIHono();
    this.setRoutes();
  }

  public getRouter(): OpenAPIHono {
    return this.app;
  }

  private setRoutes(): void {
    this.app.route("/mcp", this.mcpRouter.getRouter());
    this.app.route("/estimations", this.estimationsRouter.getRouter());
    this.app.route("/routes", this.routesRouter.getRouter());
  }
}
