import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import { OpenAPIHono } from "@hono/zod-openapi";
import { inject, injectable } from "@needle-di/core";
import { OpenAPIService } from "./openapi-service.ts";
import { APIRouter } from "../../api/routers/api-router.ts";
import { RootRouter } from "../routers/root-router.ts";
import { ErrorHandlingService } from "./error-handling-service.ts";

@injectable()
export class HTTPService {
  private app: OpenAPIHono;

  constructor(
    private rootRooter = inject(RootRouter),
    private apiRouter = inject(APIRouter)
  ) {
    this.app = new OpenAPIHono();
    this.configure();
    this.setMiddlewares();
    this.setRoutes();
  }

  public async listen(): Promise<void> {
    const server = Deno.serve(this.app.fetch);
    await server.finished;
  }

  private configure(): void {
    ErrorHandlingService.configure(this.app);
    OpenAPIService.configure(this.app);
  }

  private setMiddlewares(): void {
    this.app.use("*", logger());
    this.app.use("*", serveStatic({ root: "./static" }));
  }

  private setRoutes(): void {
    this.app.route("/", this.rootRooter.getRouter());
    this.app.route("/api", this.apiRouter.getRouter());

    OpenAPIService.setRoutes(this.app);
  }
}
