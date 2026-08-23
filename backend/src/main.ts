import { Container } from "@needle-di/core";
import { HTTPService } from "./core/services/http-service.ts";

const container = new Container();

const httpService = container.get(HTTPService);
await httpService.listen();
