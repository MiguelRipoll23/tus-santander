import { FormattedMessage } from "react-intl";
import { useState, useEffect } from "react";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Search } from "@openai/apps-sdk-ui/components/Icon";
import {
  callTool,
  useToolInput,
  useToolOutput,
  useInitializeBridge,
} from "../utils/mcp-apps-bridge-utils.ts";
import type { ToolCallResult } from "../utils/mcp-apps-bridge-utils.ts";
import { EmptyMessage } from "@openai/apps-sdk-ui/components/EmptyMessage";
import { APP_INFO } from "../constants/mcp-apps-constants.ts";
import type {
  StopEstimationsInput,
  StopEstimationsOutput,
} from "../interfaces/mcp-estimations.ts";

export default function EstimationsWidget() {
  const ready = useInitializeBridge(APP_INFO);
  const renderToolInput: StopEstimationsInput | null = useToolInput<StopEstimationsInput>();
  const renderToolOutput: StopEstimationsOutput | null = useToolOutput<StopEstimationsOutput>();
  const [widgetData, setWidgetData] = useState<StopEstimationsOutput | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (renderToolOutput) {
      setWidgetData(renderToolOutput);
    }
  }, [renderToolOutput]);

  useEffect(() => {
    const notifyHeight = () => {
      const height = document.documentElement.scrollHeight;
      if (height && window.openai?.notifyIntrinsicHeight) {
        window.openai.notifyIntrinsicHeight(height);
      }
    };
    notifyHeight();
    const observer = new ResizeObserver(notifyHeight);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [ready, widgetData]);

  const refresh = async () => {
    const requestedStopName = widgetData?.requestedStopName ?? renderToolInput?.stopName;
    const requestedLineLabel = widgetData?.requestedLineLabel ?? renderToolInput?.lineLabel ?? null;

    if (!requestedStopName) return;

    setIsRefreshing(true);
    try {
      const renderResult: ToolCallResult = await callTool("stops.render_estimations", {
        stopName: requestedStopName,
        lineLabel: requestedLineLabel,
      } satisfies StopEstimationsInput);

      if (renderResult?.isError || !renderResult?.structuredContent) {
        console.error("Render tool error:", renderResult?.content);
        return;
      }

      setWidgetData(renderResult.structuredContent as StopEstimationsOutput);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!ready) {
    return (
      <div className="widget-shell antialiased px-4 pb-2">
        <div className="py-8 flex flex-col items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          <span className="text-sm text-black/60 dark:text-zinc-400">Loading...</span>
        </div>
      </div>
    );
  }

  const isEmptyResult = widgetData && (widgetData.activeLines?.length ?? 0) === 0;

  const renderEmpty = () => (
    <EmptyMessage fill="none" className="pt-4">
      <EmptyMessage.Icon size="sm">
        <Search />
      </EmptyMessage.Icon>
      <EmptyMessage.Description>
        No results found matching{" "}
        <span className="font-semibold">
          "{widgetData?.requestedStopName ?? renderToolInput?.stopName}
          {(widgetData?.requestedLineLabel ?? renderToolInput?.lineLabel)
            ? ` - ${widgetData?.requestedLineLabel ?? renderToolInput?.lineLabel}`
            : ""}"
        </span>
      </EmptyMessage.Description>
    </EmptyMessage>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      <span className="text-sm text-black/60 dark:text-zinc-400">Loading results...</span>
    </div>
  );

  const renderLines = () => {
    const lines = widgetData?.activeLines?.slice(0, 5) || [];
    return (
      <div className="min-w-full text-sm flex flex-col">
        {lines.map((line) => (
          <div key={line.label} className="px-3 -mx-2 rounded-2xl">
            <div className="flex w-full items-stretch gap-2">
              <div className="flex flex-col items-start justify-center py-1 min-w-0 grow">
                <span className="heading-xs mb-1">{line.label}</span>
                <span className="truncate max-w-[40ch] text-black/60 dark:text-zinc-400">
                  {line.destination}
                </span>
              </div>
              <div className="flex items-center justify-end py-1 pl-4 shrink-0 ml-auto text-right">
                <span className="font-bold text-base">
                  {line.arrivals.next ?? "--"}
                </span>
                <span className="text-xs px-1 text-black/60 dark:text-zinc-400">
                  / {line.arrivals.following ?? "--"}
                </span>
                <span className="text-[10px] text-black/60 dark:text-zinc-400">
                  MIN
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (!widgetData) return renderLoading();
    if (isEmptyResult) return renderEmpty();

    return (
      <>
        <div className="max-w-full">
          <div className="flex flex-row items-center gap-4 pt-4 pb-1">
            <div className="flex flex-col items-start w-full">
              <div className="text-sm sm:text-base font-medium w-full text-left">
                {widgetData.stopName}
              </div>
              {!widgetData.requestedLineLabel && (
                <div className="text-xs sm:text-sm text-black/60 dark:text-zinc-400 w-full text-left">
                  <FormattedMessage id="estimations.limited.preview" />
                </div>
              )}
            </div>
          </div>
          {renderLines()}
        </div>

        <div className="w-full pt-3 pb-3 flex justify-end">
          <Button
            color="primary"
            size="lg"
            variant="solid"
            block
            onClick={refresh}
            disabled={isRefreshing}
          >
            <FormattedMessage
              id="estimations.refresh"
              defaultMessage="Refresh"
            />
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="widget-shell antialiased px-4 pb-2">
      {renderContent()}
    </div>
  );
}
