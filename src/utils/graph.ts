import { SkPath, Skia } from "@shopify/react-native-skia";
import { DataPoint } from "../types";
import { curveBasis, line, scaleLinear, scaleTime } from "d3";
const POINT_MAX = 31;
interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}
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
export const makeGraph = (
  dimensions: { width: number; height: number },
  steps: DataPoint[]
): GraphData => {
  const { width, height } = dimensions;
  const data = populateMissingSteps(steps);
  const min = Math.min(...data.map((v) => v.value));
  const max = Math.max(...data.map((v) => v.value));

  const start = new Date(steps[0].date);
  const end = new Date(steps[steps.length - 1].date);

  const getYAxis = scaleLinear()
    .domain([0, 15000])
    .range([height + 35, 0]);
  const getXAxis = scaleTime()
    .domain([start, end])
    .range([0, width - 10]);

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

export const makeGraph2 = (
  dimensions: { width: number; height: number },
  steps: DataPoint[]
): GraphData => {
  const { width, height } = dimensions;
  const data = populateMissingSteps(steps);
  const min = Math.min(...data.map((v) => v.value / 13000));
  const max = Math.max(...data.map((v) => v.value / 13000));

  const start = new Date(steps[0].date);
  const end = new Date(steps[steps.length - 1].date);

  const getYAxis = scaleLinear()
    .domain([0, 130000])
    .range([height + 35, 0]);
  const getXAxis = scaleTime()
    .domain([start, end])
    .range([0, width - 10]);

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
