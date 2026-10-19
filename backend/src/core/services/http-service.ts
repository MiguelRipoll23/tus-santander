import { logger } from "hono/logger";
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

  public fetch(request: Request): Response | Promise<Response> {
    return this.app.fetch(request);
  }

  private configure(): void {
    ErrorHandlingService.configure(this.app);
    OpenAPIService.configure(this.app);
  }

  private setMiddlewares(): void {
    this.app.use("*", logger());
  }

  private setRoutes(): void {
    this.app.route("/", this.rootRooter.getRouter());
    this.app.route("/api", this.apiRouter.getRouter());

    OpenAPIService.setRoutes(this.app);
  }
}
