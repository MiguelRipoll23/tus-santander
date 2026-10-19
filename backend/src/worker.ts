import { Container } from "@needle-di/core";
import { HTTPService } from "./core/services/http-service.ts";

let httpService: HTTPService | undefined;

function getHTTPService(): HTTPService {
  if (!httpService) {
    const container = new Container();
    httpService = container.get(HTTPService);
  }

  return httpService;
}

export default {
  fetch: (request: Request): Response | Promise<Response> =>
    getHTTPService().fetch(request),
} satisfies ExportedHandler<Cloudflare.Env>;
