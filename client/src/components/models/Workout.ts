
export interface Exercise {
  name: string;
  reps: number;
  weight: number;
  numSeries: number;
  series: Array<Series>;
}
export interface Series {
  index: number;
  reps: number;
  effort: number;
  tillFailure: boolean;
}
