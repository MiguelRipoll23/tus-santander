import { OpenAPIHono } from "@hono/zod-openapi";
import { V1Router } from "../versions/v1/routers/v1-rooter.ts";
import { inject, injectable } from "@needle-di/core";
import { cors } from "hono/cors";

@injectable()
export class APIRouter {
  private app: OpenAPIHono;

  constructor(private v1Router = inject(V1Router)) {
    this.app = new OpenAPIHono();
    this.setMiddlewares();
    this.setRoutes();
  }

  public getRouter(): OpenAPIHono {
    return this.app;
  }

  private setMiddlewares(): void {
    this.app.use(
      "*",
      cors({
        origin: (origin) => origin,
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Requested-With",
          "Accept",
          "mcp-protocol-version",
          "mcp-method",
          "mcp-name",
        ],
      })
    );
  }

  private setRoutes(): void {
    this.app.route("/v1", this.v1Router.getRouter());
  }
}
