import { useEffect, useState } from "react";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Steps } from "../types";
import {
  getCurrenWeekDates,
  getCurrentMontDates,
  getCurrentYearDates,
} from "../utils/dateUtils";


export default () => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [steps, setSteps] = useState<Steps>();

  const readSampleData = async () => {
    // // initialize the client
    // const isInitialized = await initialize();

    // // request permissions
    // const grantedPermissions = await requestPermission([
    //   { accessType: "read", recordType: "Steps" },
    // ]);

    // // check if granted

    // const result = await readRecords("Steps", {
    //   timeRangeFilter: {
    //     operator: "between",
    //     startTime: "2024-03-04T08:00:00.405Z",
    //     endTime: "2024-03-09T23:53:15.405Z",
    //   },
    // });
  };
  const initIalize = async () => {
        // initialize the client
        const isInitialized = await initialize();

        // request permissions
        const grantedPermissions = await requestPermission([
          { accessType: "read", recordType: "Steps" },
        ]);
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
    initIalize().then(() => {
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
    await update({ today, week, month, year });

    const steps = { today, week, month, year };

    setSteps(steps);
  };

  const update = async (steps: Steps) => {
    try {
      const isElaspsed = await isTimeElasped();
      if (isElaspsed) {
        console.log("elapsed");

        await AsyncStorage.setItem("lastUpdateTime", `${new Date().getTime()}`);
        // call axios vers endpoint back
      }
    } catch (e) {
      throw new Error("Fail store updatetime");
    }
  };

  const isTimeElasped = async () => {
    try {
      // Récupérer le dernier timestamp enregistré
      const lastUpdateTime = await AsyncStorage.getItem("lastUpdateTime");
      if (lastUpdateTime === null) {
        // S'il n'y a pas de timestamp enregistré, considérez que 24 heures se sont écoulées
        return true;
      }

      // Convertir la chaîne en nombre
      const lastUpdateTimestamp = parseInt(lastUpdateTime, 10);

      // Obtenir le timestamp actuel
      const maintenant = Date.now();

      // Vérifier si 24 heures se sont écoulées//24 * 60 * 60 *
      return maintenant - lastUpdateTimestamp >= 60 * 60 * 1000;
    } catch (error) {
      // Gérer les erreurs de récupération de données AsyncStorage
      console.error(
        "Erreur lors de la récupération du dernier timestamp :",
        error
      );
      // Considérez qu'il s'est écoulé 24 heures pour éviter de ne pas effectuer d'action
      return true;
    }
  };

  return { steps };
};
