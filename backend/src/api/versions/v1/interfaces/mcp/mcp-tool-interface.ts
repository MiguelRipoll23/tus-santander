import type { z } from "zod";

export interface McpToolRunResult<TStructured = unknown> {
  text: string;
  structuredContent?: TStructured;
  isError?: boolean;
  _meta?: Record<string, unknown>;
}

export interface ToolAnnotations {
  /**
   * If true, the tool does not modify its environment.
   * Default: false
   */
  readOnlyHint?: boolean;

  /**
   * If true, the tool may perform destructive updates to its environment.
   * If false, the tool performs only additive updates.
   * (This property is meaningful only when readOnlyHint == false)
   * Default: true
   */
  destructiveHint?: boolean;

  /**
   * If true, calling the tool repeatedly with the same arguments will have
   * no additional effect on its environment.
   * (This property is meaningful only when readOnlyHint == false)
   * Default: false
   */
  idempotentHint?: boolean;

  /**
   * If true, this tool may interact with an "open world" of external entities.
   * If false, the tool's domain of interaction is closed.
   * Default: true
   */
  openWorldHint?: boolean;

  /**
   * A human-readable title for the tool.
   */
  title?: string;
}

export interface McpToolUI {
  resourceUri: string;
}

export interface McpToolDefinition<TStructured = unknown> {
  name: string;
  meta: {
    title: string;
    description: string;
    inputSchema: z.ZodTypeAny;
    outputSchema?: z.ZodTypeAny;
    annotations?: ToolAnnotations;
    _meta?: {
      ui?: McpToolUI;
      "openai/outputTemplate"?: string;
      "openai/toolInvocation/invoking"?: string;
      "openai/toolInvocation/invoked"?: string;
    };
  };
  run: (
    input: unknown,
  ) => McpToolRunResult<TStructured> | Promise<McpToolRunResult<TStructured>>;
}
