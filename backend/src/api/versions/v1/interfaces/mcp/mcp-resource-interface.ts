export interface McpResourceDefinition {
  name: string;
  uri: string;
  meta: {
    description?: string;
    cacheHint?: {
      ttlMs?: number;
      cacheScope?: "public" | "private";
    };
  };
  run: () => Promise<{
    contents: Array<{
      uri: string;
      mimeType: string;
      text: string;
      _meta?: {
        ui?: {
          prefersBorder?: boolean;
          domain?: string;
          csp?: {
            connectDomains?: string[];
            resourceDomains?: string[];
            frameDomains?: string[];
          };
        };
        "openai/widgetDescription"?: string;
      };
    }>;
  }>;
}