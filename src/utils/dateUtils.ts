import dayjs from "dayjs";
const getDay = (date: Date) => {
  const day = date.getDay();
  return day === 0 ? 1 : day - 5;
};
function getWeekDates(startDate: Date): Date[] {
  const weekDates = [];
  const currentDate = getMondayOfCurrentWeek(startDate);

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);
    weekDates.push(nextDate);
  }

  return weekDates;
}
function getMondayOfCurrentWeek(today: Date): Date {
  const currentDayOfWeek = today.getDay();
  const daysToAdd = currentDayOfWeek === 0 ? -5 : 1 - (currentDayOfWeek - 1); // Adjust for Sunday

  const mondayOfCurrentWeek = new Date(today);
  mondayOfCurrentWeek.setDate(today.getDate() + daysToAdd);
  mondayOfCurrentWeek.setHours(0, 0, 0, 0);

  return mondayOfCurrentWeek;
}
const getCurrenWeekDates = () => {
  const dates: Date[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  currentDate.setHours(23, 30);
  const monday = getMondayOfCurrentWeek(currentDate);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() - 1 + i);
    d.setHours(currentDate.getHours());
    dates.push(d);
  }

  return dates;
};

function getCurrentMontDates() {
  const dates: Date[] = [];
  const dateActuelle = new Date();
  dateActuelle.setDate(1);
  // dateActuelle.setHours(23);
  const annee = dateActuelle.getFullYear();
  const mois = dateActuelle.getMonth();

  // Récupérer le nombre de jours dans le mois courant
  const dernierJourDuMois = new Date(annee, mois + 1, 0, 23).getDate();

  // Créer un tableau pour stocker les dates

  // Boucle pour ajouter chaque jour du mois courant au tableau

  const d = new Date();
  for (let jour = 0; jour < dernierJourDuMois; jour++) {
    // if (jour <= d.getDate()) {
    // }
    const date = new Date(dateActuelle);
    date.setDate(dateActuelle.getDate() + jour);
    dates.push(date);
  }

  return dates;
}
const getCurrentYearDates = () => {
  const dates: Date[] = [];
  const dateActuelle = new Date();
  const annee = dateActuelle.getFullYear();

  for (let mois = 0; mois < 12; mois++) {
    // Créer une nouvelle date pour le premier jour du mois

    const d = new Date();
    d.setDate(1);
    d.setFullYear(annee);
    d.setMonth(mois);
    // Ajouter la date du premier jour du mois au tableau
    dates.push(d);
  }
  return dates;
};
/*

*/
function formatedDate(date: Date, locale = "fr-FR") {
  let dayString = date.toLocaleDateString(locale, { weekday: "long" });
  dayString = capitalizeString(dayString.substring(0, dayString.indexOf(" ")));
  const dayNum = date.toLocaleDateString(locale, { day: "numeric" });
  const monthString = capitalizeString(
    date.toLocaleDateString(locale, { month: "short" })
  );
  return `${dayString} ${dayNum} ${monthString}`;
}
function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function spliceByDateRange<T extends { date: string }>(
  start: Date,
  end: Date,
  array: T[]
): T[] {
  return array.filter((item) => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return itemDate >= start && itemDate <= end;
  });
}
const getDatesbyRange = (start: string, end: string) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const diff = endDate.diff(startDate, "day");
  const dates = [];
  for (let i = 0; i <= diff; i++) {
    let day;
    if (i < diff) {
      day = startDate.add(i, "day").add(23, "hours").toDate();
    } else {
      day = dayjs().toDate();
    }
    dates.push(day);
  }
  return dates;
};
export {
  getWeekDates,
  formatedDate,
  spliceByDateRange,
  getMondayOfCurrentWeek,
  getCurrenWeekDates,
  getCurrentMontDates,
  getCurrentYearDates,
  getDatesbyRange,
};
