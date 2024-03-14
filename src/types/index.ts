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
  id?: number;
}

export interface IStepContext {
  stats?: IChallenge;
  totalSteps: number;
  isLoading: boolean;
  handleUpdateDaily?: () => Promise<any>;
  handleFetchStats: () => Promise<void>;
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

export type User = {
  id: string;
  avartId: number;
  code: string;
  challenges: Array<any>;
  daily_steps: Array<any>;
};
