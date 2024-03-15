import { useMemo } from "react";
import { DataStep } from "../Wavelet/data";
import { getWeekDates, spliceByDateRange } from "../utils/dateUtils";

export default (
  steps: Array<{
    date: string;
    value: number;
  }>
) => {
  const data = useMemo(() => {
    const currentWeekDates = getWeekDates(new Date());
    const start = currentWeekDates[0];
    const end = currentWeekDates[currentWeekDates.length - 1];
    const weekStep = spliceByDateRange(start, end, steps);

    const t = weekStep
      .map((el, i) => ({
        ...el,
        date: new Date(el.date),
        progress: el.value / 10000,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return weekStep
      .map((el, i) => ({
        ...el,
        date: new Date(el.date),
        progress: el.value / 10000,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [steps]);

  return data;
};
