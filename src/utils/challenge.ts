import dayjs from "dayjs";
import { DailySteps, DataPoint } from "../types";
import {
  getCurrenWeekDates,
  getCurrentMontDates,
  getDatesbyRange,
  getMonthBound,
} from "./dateUtils";

export const OBJECTIF = {
  terre: {
    id: 4,
    message: "Bravo!",
    title: "Objectifs Terre",
    source: require("../../assets/4.webp"),
    steps: 12000000,
    description: "40 000 Kilomètre parcourue",
  },
  europe: {
    id: 3,
    message: "Bravo! bientot le tour du monde 12000000 pas",
    title: "Objectifs Europe",
    source: require("../../assets/3.webp"),
    steps: 5000000,
    description: "4 000 kilomètres",
  },
  france: {
    id: 2,
    message: "Bravo! vous avez traverser la France",
    title: "Objectifs France",
    source: require("../../assets/2.webp"),
    steps: 733333,
    description: "1 000 Kilomètre parcourue",
  },
  begin: {
    id: 1,
    message:
      "Bravo vous avez fait vos premiers, des petits a plusieurs un grand pas pour le CHU",
    title: "Objectifs",
    source: require("../../assets/icons/objectif/1.png"),
    steps: 1000,
    description: "1 000 Kilomètre parcourue",
  },
};

export const getObjectifByStep = (nombreDePas: number) => {
  if (nombreDePas >= 12000000) {
    return OBJECTIF.terre;
  } else if (nombreDePas >= 5000000) {
    return OBJECTIF.europe;
  } else if (nombreDePas >= 733333) {
    return OBJECTIF.europe;
  } else {
    return OBJECTIF.begin;
  }
};

export const getCurrentMonthDailySteps = (
  dailySteps: DailySteps[]
): DataPoint[] => {
  const currentMonthDates = getCurrentMontDates();
  const { start, end } = getMonthBound();
  const monthSteps = dailySteps.reduce(
    (acc: { [key: string]: number }, dailySteps) => {
      const day = dayjs(dailySteps.day).format("YYYY-MM-DD");
      if (!acc[day]) {
        acc[day] = dailySteps.stepCount || 0;
      } else {
        acc[day] = acc[day] + (dailySteps.stepCount || 0);
      }
      return acc;
    },
    {}
  );

  return currentMonthDates.map((date, i) => {
    const day = dayjs(date).format("YYYY-MM-DD");
    return { value: monthSteps[day] || 0, date: date.toISOString() };
  });
};

export const getCurrentWeekDailySteps = (
  dailySteps: DailySteps[]
): DataPoint[] => {
  const currentWeekDates = getCurrenWeekDates();
  const { start, end } = getMonthBound();
  const weekSteps = dailySteps.reduce(
    (acc: { [key: string]: number }, dailySteps) => {
      const day = dayjs(dailySteps.day).format("YYYY-MM-DD");
      if (!acc[day]) {
        acc[day] = dailySteps.stepCount || 0;
      } else {
        acc[day] = acc[day] + (dailySteps.stepCount || 0);
      }
      return acc;
    },
    {}
  );

  return currentWeekDates.map((date, i) => {
    const day = dayjs(date).format("YYYY-MM-DD");
    return { value: weekSteps[day] || 0, date: date.toISOString() };
  });
};
