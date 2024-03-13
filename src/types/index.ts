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
  totalSteps: number;
  isLoading: boolean;
  handleUpdateDaily?: () => Promise<any>;
  handleFetchTotals?: () => Promise<IChallenge>;
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

export interface IChallenge {
  totalSteps: 0;
  totalWeekSteps: 0;
  totalMonthSteps: 0;

  challengeSteps: Array<Partial<DailySteps & { id: number }>>;
  weekSteps: Array<Partial<DailySteps & { id: number }>>;
  monthSteps: Array<Partial<DailySteps & { id: number }>>;
}
