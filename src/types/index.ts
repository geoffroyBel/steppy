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
