import { useEffect, useState } from "react";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataPoint, Steps } from "../types";
import {
  getCurrenWeekDates,
  getCurrentMontDates,
  getCurrentYearDates,
  getDatesbyRange,
} from "../utils/dateUtils";


export default () => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [steps, setSteps] = useState<Steps>();

  const initIalize = async () => {
    try {
      const isInitialized = await initialize();
      // request permissions
      const grantedPermissions = await requestPermission([
        { accessType: "read", recordType: "Steps" },
      ]);
    } catch (error) {
      throw new Error("probleme de permissions");
    }
  };
  useEffect(() => {
    initIalize().then((e) => {
      setHasPermissions(true);
    }).catch((error) => {
      console.error("Initialization error:", error);
      setHasPermissions(false);
    });
  }, []);
  
  useEffect(() => {
    if (!hasPermissions) {
      return;
    }
     getAllSteps();
  }, [hasPermissions]);
  const getSteps = async ({
    from,
    to,
  }: {
    from: string;
    to: string;
  }): Promise<DataPoint[]> => {
    const datesToUpdate = getDatesbyRange(from, to);
    const newSteps = await getStepsByDates(datesToUpdate);

    return newSteps;
  };
  const getStepsByDates = (dates: Date[]) => {
    return dates.reduce(async (a: Promise<any>, el) => {
      var end = new Date(el.toISOString());
      end.setHours(23, 55);
      var start = new Date(el.toISOString());
      start.setHours(1);

      const data = await a;
      const result: Partial<Array<{ count: number; startTime: string }>> =
        await readRecords("Steps", {
          timeRangeFilter: {
            operator: "between",
            startTime: start.toISOString(),
            endTime: end.toISOString(),
          },
        });

      return [
        ...data,
        {
          date: el.toISOString(),
          value: result.reduce((value, step) => value + (step?.count || 0), 0),
        },
      ];
    }, Promise.resolve([]));
  };

  const getAllSteps = async () => {
    const currentWeekDates = getCurrenWeekDates();
    const currentMonthDates = getCurrentMontDates();
    const currentYearDates = getCurrentYearDates();

    const today = await getStepsByDates([new Date()]);
    const week = await getStepsByDates(currentWeekDates);
    const month = await getStepsByDates(currentMonthDates);
    const year = await getStepsByDates(currentYearDates);

    const steps = { today, week, month, year };

    setSteps(steps);
  };

  return { steps, getSteps };
};
