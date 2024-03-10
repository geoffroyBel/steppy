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
  getMondayOfCurrentWeek,
} from "../utils/dateUtils";
import { DataPoint } from "../utils/data";
import { Steps } from "../types";

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

  return { steps };
};
