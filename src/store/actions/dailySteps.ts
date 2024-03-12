//{{baseUrl}}/api/daily-steps
import api from "../../api";
import { DailySteps } from "../../types";
import { getMaxDayToUpdate, getMaxLastUpdateDate } from "../../utils/stepUtils";

export async function createDailySteps(dailySteps: DailySteps) {
  try {
    const response = await api.post(`/daily-steps`, dailySteps, {
      withCredentials: true,
    });
  } catch (error: unknown) {
    throw new Error("Fail create User");
  }
}

export async function getLastDailySteps() {
  try {
    const {
      data: { day, stepCount },
    } = await api.get(`/daily-steps/user/last`, {
      withCredentials: true,
    });
    updateMissingDailySteps(new Date(day), new Date());
    return { day, stepCount };
  } catch (error: unknown) {
    throw new Error("Fail create User");
  }
}

export const updateMissingDailySteps = (from: Date, to: Date) => {
  console.log(from.toISOString());
  console.log(to.toISOString());

  const { max, lastUpdatedate } = getMaxLastUpdateDate(
    "2024-03-01",
    to.toISOString()
  );

  const dates = new Array(max)
    .fill(0)
    .map((_, i) => lastUpdatedate.subtract(i, "day").format());

  // dates.reduce(async (p, el) => {
  //   await p
  //   return
  // }, [Promise.resolve()])

  // const start = day
  // new Array(maxDays).fill(1).reduce(() => {

  // }, [Promise.resolve([])])
};
