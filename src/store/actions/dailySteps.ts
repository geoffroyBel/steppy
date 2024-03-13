//{{baseUrl}}/api/daily-steps
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import { DailySteps, DataPoint, GetPodemeterStep } from "../../types";
import { getDatesbyRange } from "../../utils/dateUtils";
import { getMaxLastUpdateDate } from "../../utils/stepUtils";
import dayjs from "dayjs";
import { LAST_DAILY_STEP_TIMESTAMP } from "../../config";

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
    } = await api.get(`/users/daily-steps/last`, {
      withCredentials: true,
    });
    return { day, stepCount };
  } catch (error: unknown) {
    throw new Error("Fail create User");
  }
}

export const updateDailySteps = async (getPodometerSteps: GetPodemeterStep) => {
  const { day } = await getLastDailySteps();
  const newSteps = await getPodometerSteps({
    from: day,
    to: new Date().toDateString(),
  });

  newSteps.reduce(
    async (promise: Promise<any>, step: { date: string; value: number }) => {
      const data = await promise;
      const result = await createDailySteps({
        day: dayjs(step.date).format("YYYY-MM-DD"),
        stepCount: step.value,
      });
      console.log("ohllllllll");
      console.log("leplus important");

      console.log(result.data);
      return data;
    },
    Promise.resolve([])
  );
  await AsyncStorage.setItem(
    LAST_DAILY_STEP_TIMESTAMP,
    `${new Date().getTime()}`
  );
};
export const updateMissingDailySteps = (from: Date, to: Date) => {
  const { max, lastUpdatedate } = getMaxLastUpdateDate(
    "2024-03-01",
    to.toISOString()
  );

  const dates = new Array(max)
    .fill(0)
    .map((_, i) => lastUpdatedate.subtract(i, "day").format());
};
