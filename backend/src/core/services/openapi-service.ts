import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

export class OpenAPIService {
  public static configure(_app: OpenAPIHono): void {}

  public static setRoutes(app: OpenAPIHono): void {
    app.doc31("/.well-known/openapi", {
      openapi: "3.1.0",
      info: {
        version: "1.0.0",
        title: "TUS Santander API",
        description: "Real-time bus arrival and route API for Santander's urban transit (TUS)",
      },
    });

    app.get(
      "/",
      Scalar({
        url: "/.well-known/openapi",
        pageTitle: "TUS Santander API",
        metaData: {
          title: "TUS Santander API",
          description: "Real-time bus arrival and route API for Santander's urban transit (TUS)",
          ogTitle: "TUS Santander API",
          ogDescription: "Real-time bus arrival and route API for Santander's urban transit (TUS)",
        },
        defaultOpenAllTags: true,
      })
    );
  }
}
