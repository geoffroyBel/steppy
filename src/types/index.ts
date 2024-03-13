export type DataPoint = {
  date: string;
  value: number;
};
export interface Steps {
  today: DataPoint[];
  week: DataPoint[];
  month: DataPoint[];
  year: DataPoint[];
}

export interface Credentials {
  code: string;
  password: string;
}

export interface DailySteps {
  stepCount: number;
  day: string;
}

export interface IStepContext {
  isLoading: boolean;
  handleUpdateDaily?: () => Promise<any>;
  handleFetchDaily?: (range: {
    from: string;
    to: string;
  }) => Promise<DataPoint[]>;
}

export type GetPodemeterStep = (range: {
  from: string;
  to: string;
}) => Promise<DataPoint[]>;

export type Range = { from: string; to: string };
