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
  const getStepsByDates = async (dates: Date[]) => {
    var start = new Date(dates[0].toISOString());
    start.setHours(1);
    var end = new Date(dates[dates.length - 1].toISOString());
    end.setHours(23, 55);
  
    const result: Partial<Array<{ count: number; startTime: string }>> =
      await readRecords("Steps", {
        timeRangeFilter: {
          operator: "between",
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        },
      });
  
    return dates.map((el) => ({
      date: el.toISOString(),
      value: result.reduce(
        (value, step) =>
          new Date(step?.startTime ?? "").toDateString() === el.toDateString()
            ? value + (step?.count || 0)
            : value,
        0
      ),
    }));
  };

  const getAllSteps = async () => {
    console.log("--------week");
    const currentWeekDates = getCurrenWeekDates();
    const currentMonthDates = getCurrentMontDates();
    const currentYearDates = getCurrentYearDates();

    const today = await getStepsByDates([new Date()]);
    const week = await getStepsByDates(currentWeekDates);
    const month = await getStepsByDates(currentMonthDates);
    const year = await getStepsByDates(currentYearDates);

    const steps = { today, week, month, year };

    console.log(steps.week);

    setSteps(steps);
  };

  return { steps, getSteps };
};
