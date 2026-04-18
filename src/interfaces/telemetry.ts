import type { TelemetryEventType } from "../types/telemetry";

export interface TelemetryEventInput {
  type: TelemetryEventType;
  data: Record<string, unknown>;
}

export interface TelemetryEvent extends TelemetryEventInput {
  timeStamp: number;
}

export interface DeviceInformation {
  timeStamp: number;
  userAgent: string;
  browserLanguage: string;
  screenWidth: number;
  screenHeight: number;
}

export interface TelemetryPayload {
  userId: string;
  sessionId: string;
  sessionStart: number;
  deviceInformation: DeviceInformation;
  events: TelemetryEvent[];
}

export interface SessionInfo {
  id: string;
  start: number;
}
