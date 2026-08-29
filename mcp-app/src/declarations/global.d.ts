/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    openai?: {
      locale?: string;
      theme?: string;
      displayMode?: "inline" | "pip" | "fullscreen";
      maxHeight?: number;
      toolInput?: any;
      toolOutput?: any;
      setWidgetState?: (state: any) => void;
      callTool?: (name: string, args: any) => Promise<any>;
      sendFollowUpMessage?: (args: { prompt: string }) => Promise<void>;
      uploadFile?: (file: File) => Promise<{ fileId: string }>;
      getFileDownloadUrl?: (args: {
        fileId: string;
      }) => Promise<{ downloadUrl: string }>;
      requestDisplayMode?: (args: any) => Promise<void>;
      requestModal?: (args: any) => Promise<void>;
      openExternal?: (args: { href: string }) => void;
      notifyIntrinsicHeight?: (height: number) => void;
    };
  }

  interface AppsSDKUIConfig {
    LinkComponent: typeof Link;
  }
}

export {};
