// Type definition for MCP providers
import { McpToolDefinition } from "../../interfaces/mcp/mcp-tool-interface.ts";
import { McpPromptDefinition } from "../../interfaces/mcp/mcp-prompt-interface.ts";
import { McpResourceDefinition } from "../../interfaces/mcp/mcp-resource-interface.ts";

export type McpProvider = {
  getTools(): McpToolDefinition[];
  getPrompts(): McpPromptDefinition[];
  getResources?: () => McpResourceDefinition[];
};
