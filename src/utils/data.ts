import { curveBasis, line, scaleLinear, scaleTime } from "d3";
import { getWeekDates } from "./dateUtils";
import { lastDayOfMonth } from "./waveletUtils";
import { Skia } from "@shopify/react-native-skia";
const POINT_MAX = 31;
export type DataPoint = {
  date: string;
  value: number;
};
export interface DataStep {
  date: string;
  value: number;
}
export const makeGraph = (data: DataPoint[], width: number, height: number) => {
  const min = Math.min(...data.map((v) => v.value));
  const max = Math.max(...data.map((v) => v.value));

  const getYAxis = scaleLinear().domain([0, max]).range([height, 0]);
  const getXAxis = scaleTime()
    .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
    .range([-10, width]);

  const curvedLine = line<DataPoint>()
    .x((d) => getXAxis(new Date(d.date)))
    .y((d) => getYAxis(d.value))
    .curve(curveBasis)(data);
  // data.map((d, i) => console.log(getXAxis.invert(100)));
  const curve = Skia.Path.MakeFromSVGString(curvedLine!)!;

  return {
    min,
    max,
    curve,
  };
};
export const getMockStepData = (): DataStep[] => {
  return new Array(15).fill(0).map((_, index) => {
    const d = new Date();
    d.setDate(new Date().getDate() + 7 - index);
    return {
      date: d.toISOString(),
      value: Math.floor(Math.random() * (9000 + 1)) + 1000,
    };
  });
};

export const populateMissingSteps = (data: DataPoint[]) => {
  if (data.length < POINT_MAX) {
    const newData = [...data];
    const duplicate = data[data.length - 1];
    const counter = POINT_MAX - data.length;
    for (let i = 0; i < counter; i++) {
      newData.push(duplicate);
    }
    return newData;
  }
  return data;
};
export const originalData: DataPoint[] = [
  { date: "2000-02-01T05:00:00.000Z", value: 250 },
  { date: "2000-02-02T05:00:00.000Z", value: 300.35 },
  { date: "2000-02-03T05:00:00.000Z", value: 150.84 },
  { date: "2000-02-04T05:00:00.000Z", value: 500.92 },
  { date: "2000-02-05T05:00:00.000Z", value: 200.8 },

  // { date: "2000-02-12T05:00:00.000Z", value: 1000.47 },
  // { date: "2000-02-13T05:00:00.000Z", value: 200.47 },
  // { date: "2000-02-14T05:00:00.000Z", value: 500.47 },
  // { date: "2000-02-15T05:00:00.000Z", value: 600.47 },
];

export const animatedData: DataPoint[] = [
  { date: "2000-01-013T05:00:00.000Z", value: 500 },
  { date: "2000-02-02T05:00:00.000Z", value: 400.0 },
  { date: "2000-02-03T05:00:00.000Z", value: 300.0 },
  { date: "2000-02-04T05:00:00.000Z", value: 400.0 },
  { date: "2000-02-05T05:00:00.000Z", value: 500.0 },
  { date: "2000-02-06T05:00:00.000Z", value: 1000.98 },
  { date: "2000-02-07T05:00:00.000Z", value: 500.0 },
  { date: "2000-02-08T05:00:00.000Z", value: 200.0 },
  { date: "2000-02-09T05:00:00.000Z", value: 1300.75 },
  { date: "2000-02-10T05:00:00.000Z", value: 400.0 },
  { date: "2000-02-11T05:00:00.000Z", value: 500.0 },
  { date: "2000-02-12T05:00:00.000Z", value: 900.98 },
  { date: "2000-02-13T05:00:00.000Z", value: 600.0 },
  { date: "2000-02-14T05:00:00.000Z", value: 250.0 },
  { date: "2000-02-15T05:00:00.000Z", value: 330.67 },
];

export const animatedData2: DataPoint[] = [
  { date: "2000-01-01T05:00:00.000Z", value: 250 },
  { date: "2000-02-02T05:00:00.000Z", value: 300.0 },
  { date: "2000-02-03T05:00:00.000Z", value: 400.0 },
  { date: "2000-02-04T05:00:00.000Z", value: 100.0 },
  { date: "2000-02-05T05:00:00.000Z", value: 100.0 },
  { date: "2000-02-06T05:00:00.000Z", value: 700.0 },
  { date: "2000-02-07T05:00:00.000Z", value: 1300.11 },
  { date: "2000-02-08T05:00:00.000Z", value: 900.0 },
  { date: "2000-02-09T05:00:00.000Z", value: 100.0 },
  { date: "2000-02-10T05:00:00.000Z", value: 100.0 },
  { date: "2000-02-11T05:00:00.000Z", value: 100.0 },
  { date: "2000-02-12T05:00:00.000Z", value: 700.0 },
  { date: "2000-02-13T05:00:00.000Z", value: 1100.11 },
  { date: "2000-02-14T05:00:00.000Z", value: 900.0 },
  { date: "2000-02-15T05:00:00.000Z", value: 100.96 },
];

export const animatedData3: DataPoint[] = [
  { date: "2000-01-01T05:00:00.000Z", value: 250 },
  { date: "2000-02-02T05:00:00.000Z", value: 600.0 },
  { date: "2000-02-03T05:00:00.000Z", value: 350.0 },
  { date: "2000-02-04T05:00:00.000Z", value: 900.0 },
  { date: "2000-02-05T05:00:00.000Z", value: 80.0 },
  { date: "2000-02-06T05:00:00.000Z", value: 1000.76 },
  { date: "2000-02-07T05:00:00.000Z", value: 300.0 },
  { date: "2000-02-08T05:00:00.000Z", value: 100.0 },
  { date: "2000-02-09T05:00:00.000Z", value: 900.0 },
  { date: "2000-02-10T05:00:00.000Z", value: 900.0 },
  { date: "2000-02-11T05:00:00.000Z", value: 80.0 },
  { date: "2000-02-12T05:00:00.000Z", value: 1000.76 },
  { date: "2000-02-13T05:00:00.000Z", value: 300.0 },
  { date: "2000-02-14T05:00:00.000Z", value: 100.0 },
  { date: "2000-02-15T05:00:00.000Z", value: 900.53 },
];
export const graphs: Array<any> = [
  {
    label: "semaine",
    steps: originalData,
    timeData: ["Lu", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  },
  {
    label: "mois",
    steps: animatedData,
    timeData: [1, 7, 15, 21, lastDayOfMonth()],
  },
  {
    label: "année",
    steps: animatedData2,
    timeData: [
      "Ja",
      "Fe",
      "Ma",
      "Av",
      "Ma",
      "Ju",
      "Jui",
      "Ao",
      "Se",
      "Oc",
      "No",
      "De",
    ],
  },
];

export const scalTimeData = [];
