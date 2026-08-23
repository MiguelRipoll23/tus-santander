export interface TusApiResponse {
  line: number;
  estimations: Array<{
    destination: string;
    remainingTime: number;
  }>;
}
