export interface TusApiResponseItem {
  line: number;
  estimations: Array<{
    destination: string;
    remainingTime: number;
  }>;
}

export type TusApiResponse = TusApiResponseItem[];
