import { useEffect, useState } from "react";
import {
  HealthInputOptions,
  HealthKitPermissions,
  HealthPermission,
  HealthValue,
} from "react-native-health";
import appleHealthKit from "react-native-health";
import {
  getCurrenWeekDates,
  getCurrentMontDates,
  getCurrentYearDates,
  getDatesbyRange,
  getMondayOfCurrentWeek,
} from "../utils/dateUtils";
import { DataPoint } from "../utils/data";
import { DailySteps, Steps } from "../types";
import {
  createDailySteps,
  getLastDailySteps,
} from "../store/actions/dailySteps";
import dayjs from "dayjs";

const permissions: HealthKitPermissions = {
  permissions: {
    read: [appleHealthKit.Constants.Permissions.Steps],
    write: [appleHealthKit.Constants.Permissions.Steps],
  },
};
export default () => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [steps, setSteps] = useState<Steps>();

  useEffect(() => {
    appleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log("error getting permissions");
        return;
      }
      setHasPermissions(true);
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) {
      return;
    }
    const options: HealthInputOptions = {
      startDate: new Date(2022, 1, 1).toISOString(),
      endDate: new Date().toISOString(),
    };
    getAllSteps();
    updateStep();
    appleHealthKit.getStepCount(
      options,
      (err: Object, results: HealthValue) => {
        if (err) {
          return;
        }

        console.log(options);

        console.log(results);
      }
    );
  }, [hasPermissions]);

  const getStepCountPromise = (options: HealthInputOptions) => {
    return new Promise((resolve, reject) => {
      appleHealthKit.getStepCount(
        options,
        (err: Object, results: HealthValue) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results.value);
        }
      );
    });
  };
  const getStepsByDates = (dates: Date[]) => {
    return dates.reduce(async (a: Promise<any>, el) => {
      const data = await a;
      const result = await getStepCountPromise({ date: el.toISOString() });
      return [...data, { date: el.toISOString(), value: result }];
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

  const updateStep = async () => {
    const { day, stepCount } = await getLastDailySteps();
    const datesToUpdate = getDatesbyRange(
      "2024/03/01",
      new Date().toDateString()
    );
    const newSteps = await getStepsByDates(datesToUpdate);
    newSteps.reduce(
      async (promise: Promise<any>, step: { date: string; value: number }) => {
        const data = await promise;
        const dailyStep = {
          day: dayjs(step.date).format("YYYY-MM-DD"),
          stepCount: step.value,
        };
        await createDailySteps(dailyStep);
        console.log("succesfull insert");

        return data;
      },
      Promise.resolve([])
    );

    // const c = createDailySteps({})
    console.log(newSteps);
  };

  return { steps };
};

// const getStepsByRange = (start: string, end: string) => {

//   return dates.reduce(async (a: Promise<any>, el) => {
//     const data = await a;
//     const result = await getStepCountPromise({ date: el.toISOString() });
//     return [...data, { date: el.toISOString(), value: result }];
//   }, Promise.resolve([]));
// };
