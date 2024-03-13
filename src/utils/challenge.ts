export const OBJECTIF = {
  terre: {
    label: "Objectifs Terre",
    steps: 12000000,
    content: "40 000 Kilomètre parcourue",
  },
  europe: {
    label: "Objectifs Europe",
    steps: 5000000,
    content: "4 000 kilomètres",
  },
  france: {
    label: "Objectifs France",
    steps: 733333,
    content: "1 000 Kilomètre parcourue",
  },
  begin: {
    label: "Objectifs",
    steps: 1000,
    content: "1 000 Kilomètre parcourue",
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
