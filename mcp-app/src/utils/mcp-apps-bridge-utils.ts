import { useState, useEffect } from "react";
import { MCP_APPS_PROTOCOL_VERSION, RPC_TIMEOUT_MS } from "../constants/mcp-apps-constants";

export interface AppInfo {
  name: string;
  version: string;
}

export interface AppCapabilities {
  [key: string]: unknown;
}

export interface ToolCallResult {
  structuredContent?: unknown;
  content?: Array<{ type: string; text: string }>;
  isError?: boolean;
}

interface ToolInputPayload {
  arguments?: unknown;
  [key: string]: unknown;
}

interface RpcMessage {
  jsonrpc: "2.0";
  id?: number;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: { code: number; message: string };
}

class McpAppsBridge {
  private rpcId = 0;
  private pendingRequests = new Map<number, { resolve: (value: unknown) => void; reject: (reason: unknown) => void }>();
  private initialized = false;
  private toolInput: unknown = null;
  private toolOutput: unknown = null;
  private listeners = new Set<(key: string, value: unknown) => void>();
  private appCapabilities: AppCapabilities;
  private appInfo: AppInfo;

  constructor(appInfo: AppInfo, appCapabilities: AppCapabilities = {}) {
    this.appInfo = appInfo;
    this.appCapabilities = appCapabilities;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.listenForMessages();
    this.hydrateFromOpenAIState();

    await this.rpcRequest("ui/initialize", {
      appInfo: this.appInfo,
      appCapabilities: this.appCapabilities,
      protocolVersion: MCP_APPS_PROTOCOL_VERSION,
    });

    this.hydrateFromOpenAIState();
    this.sendNotification("ui/notifications/initialized", {});
    this.initialized = true;
  }

  private hydrateFromOpenAIState(): void {
    if (window.openai?.toolInput !== undefined) {
      this.toolInput = window.openai.toolInput;
      this.notify("toolInput", this.toolInput);
    }

    if (window.openai?.toolOutput !== undefined) {
      this.toolOutput = window.openai.toolOutput;
      this.notify("toolOutput", this.toolOutput);
    }
  }

  private listenForMessages(): void {
    window.addEventListener(
      "message",
      (event) => {
        const message = event.data as RpcMessage;
        if (!message || message.jsonrpc !== "2.0") return;

        if (typeof message.id === "number") {
          const pending = this.pendingRequests.get(message.id);
          if (!pending) return;
          this.pendingRequests.delete(message.id);

          if (message.error) {
            pending.reject(message.error);
            return;
          }

          pending.resolve(message.result);
          return;
        }

        if (typeof message.method === "string") {
          if (message.method === "ui/notifications/tool-result") {
            const params = message.params as {
              structuredContent?: unknown;
              content?: Array<{ type: string; text: string }>;
            };
            const output = params?.structuredContent ?? params?.content;
            this.toolOutput = output;
            this.notify("toolOutput", this.toolOutput);
          } else if (message.method === "ui/notifications/tool-input") {
            const params = message.params as ToolInputPayload;
            this.toolInput = params?.arguments ?? params;
            this.notify("toolInput", this.toolInput);
          }
        }
      },
      { passive: true }
    );
  }

  private rpcRequest(method: string, params?: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = ++this.rpcId;
      this.pendingRequests.set(id, { resolve, reject });
      window.parent.postMessage({ jsonrpc: "2.0", id, method, params }, "*");

      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`RPC request ${method} timed out`));
        }
      }, RPC_TIMEOUT_MS);
    });
  }

  private sendNotification(method: string, params?: unknown): void {
    window.parent.postMessage({ jsonrpc: "2.0", method, params }, "*");
  }

  private notify(key: string, value: unknown): void {
    this.listeners.forEach((listener) => listener(key, value));
  }

  subscribe(listener: (key: string, value: unknown) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async callTool(name: string, args: unknown): Promise<ToolCallResult> {
    if (!this.initialized) {
      await this.initialize();
    }

    const response = await this.rpcRequest("tools/call", {
      name,
      arguments: args,
    }) as ToolCallResult;
    
    return response || {};
  }

  getToolInput(): unknown {
    return this.toolInput;
  }

  getToolOutput(): unknown {
    return this.toolOutput;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

let bridgeInstance: McpAppsBridge | null = null;

export function initializeBridge(appInfo: AppInfo, appCapabilities: AppCapabilities = {}): McpAppsBridge {
  if (!bridgeInstance) {
    bridgeInstance = new McpAppsBridge(appInfo, appCapabilities);
  }
  return bridgeInstance;
}

export function getBridge(): McpAppsBridge | null {
  return bridgeInstance;
}

export function useToolInput<T = unknown>(): T | null {
  const [toolInput, setToolInput] = useState<T | null>(() => {
    const bridge = getBridge();
    if (bridge) {
      return (bridge.getToolInput() as T) ?? ((window.openai?.toolInput as T | undefined) ?? null);
    }
    return (window.openai?.toolInput as T | undefined) ?? null;
  });

  useEffect(() => {
    const bridge = getBridge();
    if (!bridge) return;

    const unsubscribe = bridge.subscribe((key, value) => {
      if (key === "toolInput") {
        setToolInput(value as T);
      }
    });

    return unsubscribe;
  }, []);

  return toolInput;
}

export function useToolOutput<T = unknown>(): T | null {
  const [toolOutput, setToolOutput] = useState<T | null>(() => {
    const bridge = getBridge();
    if (bridge) {
      return (bridge.getToolOutput() as T) ?? ((window.openai?.toolOutput as T | undefined) ?? null);
    }
    return (window.openai?.toolOutput as T | undefined) ?? null;
  });

  useEffect(() => {
    const bridge = getBridge();
    if (!bridge) return;

    const unsubscribe = bridge.subscribe((key, value) => {
      if (key === "toolOutput") {
        setToolOutput(value as T);
      }
    });

    return unsubscribe;
  }, []);

  return toolOutput;
}

export async function callTool(name: string, args: unknown): Promise<ToolCallResult> {
  const bridge = getBridge();
  if (!bridge) {
    throw new Error("MCP Apps bridge not initialized");
  }
  return bridge.callTool(name, args);
}

export function useInitializeBridge(appInfo: AppInfo): boolean {
  const [bridge] = useState(() => initializeBridge(appInfo));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    bridge.initialize().then(() => {
      setReady(true);
    }).catch((error) => {
      console.error("Failed to initialize bridge:", error);
    });
  }, [bridge]);

  return ready;
}
