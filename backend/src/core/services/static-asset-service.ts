import { env } from "cloudflare:workers";
import { injectable } from "@needle-di/core";

@injectable()
export class StaticAssetService {
  public async getText(path: string): Promise<string> {
    const response = await env.ASSETS.fetch(
      new URL(path, "https://tus.workers.dev")
    );

    if (!response.ok) {
      throw new Error(
        `Failed to read static asset "${path}": ${response.status}`
      );
    }

    return await response.text();
  }
}
