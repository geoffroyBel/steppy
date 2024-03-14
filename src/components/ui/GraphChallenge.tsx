import { View, StyleSheet, Text, ViewProps } from "react-native";
import withParentSize from "../../hooks/hoc/withParentSize";
import {
  Canvas,
  Fill,
  RoundedRect,
  Rect,
  Line,
  vec,
  SkPath,
  Skia,
  Path,
  LinearGradient,
} from "@shopify/react-native-skia";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { DataPoint, populateMissingSteps } from "../../utils/data";
import { curveBasis, line, scaleLinear, scaleTime } from "d3";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";
import { Steps } from "../../types";
import { makeGraph } from "../../utils/graph";
import { lastDayOfMonth } from "../../utils/dateUtils";
type GraphState = { next: number; current: number; steps?: GraphData[] };
const GRAPHS: Array<any> = [
  {
    label: "semaine",

    timeData: ["Lu", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  },
  {
    label: "mois",

    timeData: [1, 7, 15, 21, lastDayOfMonth()],
  },
];
interface IProps {
  transition: SharedValue<number>;
  state: SharedValue<GraphState>;
  parentSize: {
    width: number;
    height: number;
  };
  steps?: Steps;
}
interface IPropsFX {
  onPress: (seleted: number) => void;
}
interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}
const Graph = ({
  transition,
  state,
  parentSize: { width, height },
  steps,
}: IProps) => {
  const gap = 15;
  // const values = useMemo(() => {
  //   console.log("----------------------------------");

  //   console.log(steps.week);
  //   console.log("-----");

  //   console.log(steps.month);
  //   console.log("-----");
  //   console.log(steps.year);
  //   return 0;
  // }, [steps]);
  // const makeGraph = (steps: DataPoint[]): GraphData => {
  //   const data = populateMissingSteps(steps);
  //   const min = Math.min(...data.map((v) => v.value));
  //   const max = Math.max(...data.map((v) => v.value));

  //   const getYAxis = scaleLinear().domain([0, max]).range([height, 0]);
  //   const getXAxis = scaleTime()
  //     .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
  //     .range([-10, width]);

  //   const curvedLine = line<DataPoint>()
  //     .x((d) => getXAxis(new Date(d.date)))
  //     .y((d) => getYAxis(d.value))
  //     .curve(curveBasis)(data);
  //   // data.map((d, i) => console.log(getXAxis.invert(100)));
  //   const curve = Skia.Path.MakeFromSVGString(curvedLine!)!;

  //   return {
  //     min,
  //     max,
  //     curve,
  //   };
  // };
  // const graphs = GRAPHS.map((g) => ({
  //   ...g,
  //   steps: makeGraph({ width, height }, g.steps),
  // }));
  const empty = Skia.Path.Make();
  const path = useDerivedValue(() => {
    if (!state.value.steps) return empty;

    const { current, next } = state.value;
    const end = state.value.steps[next].curve;
    const start = state.value.steps[current].curve;
    // const end = graphs[next].steps.curve;
    // const start = graphs[current].steps.curve;

    return end.interpolate(start, transition.value)!;
  });

  // const onPress = (index: number) => {
  //   state.value = { current: state.value.next, next: index };
  //   transition.value = 0;
  //   transition.value = withTiming(1, {
  //     duration: 750,
  //   });
  // };

  return (
    <Canvas style={{ width, height }}>
      {new Array(4).fill((height - gap) / 3).map((h, index) => (
        <Line
          key={index}
          strokeWidth={0.5}
          color="lightGrey"
          p1={vec(0, index * h + gap / 2)}
          p2={vec(width, index * h + gap / 2)}
        />
      ))}
      <Path path={path} color="blue" strokeWidth={2} style={"stroke"}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, 0)}
          colors={["white", "white"]}
        />
      </Path>
    </Canvas>
  );
};
const Indicator = withParentSize(
  ({ state, parentSize: { width, height } }: IProps) => {
    return (
      <View style={{ width, height, overflow: "hidden" }}>
        {GRAPHS.map(({ timeData }, index) => {
          const style = useAnimatedStyle(() => {
            return {
              transform: [
                {
                  translateX: withTiming(
                    interpolate(
                      state.value.next,
                      [index - 1, index, index + 1],
                      [-width, 1, width]
                    )
                  ),
                },
              ],
            };
          });
          return (
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                },
                style,
              ]}
            >
              {timeData.map((d: string, i: number) => (
                <Text style={styles.scaleTimeLabel}>{d}</Text>
              ))}
            </Animated.View>
          );
        })}
      </View>
    );
  }
);

const Graphs = withParentSize<IProps>(Graph);
const GRAPH_SIZE = { width: 350, height: 115 };
export default ({ steps }: { steps?: Steps }) => {
  const transition = useSharedValue(0);
  const state = useSharedValue<GraphState>({
    next: 0,
    current: 0,
    steps: undefined,
  });

  useEffect(() => {
    if (!steps) return;
    console.log("alors cette semaine");

    console.log(steps.week);

    state.value = {
      ...state.value,
      steps: [
        makeGraph(GRAPH_SIZE, steps.week),
        makeGraph(GRAPH_SIZE, steps.month),
      ],
    };
  }, [steps]);

  const onPress = (index: number) => {
    state.value = { ...state.value, current: state.value.next, next: index };
    transition.value = 0;
    transition.value = withTiming(1, {
      duration: 750,
    });
  };

  return (
    <View style={{ height: 250, width: "100%", gap: 10 }}>
      <ButtonGroup selectIndex={0}>
        <Button label={"Semaine"} onPress={() => onPress(0)} />
        <Button label={"Mois"} onPress={() => onPress(1)} />
      </ButtonGroup>
      <View style={styles.container}>
        <View style={styles.steps}>
          <View style={{ paddingVertical: 0, flex: 1 }}>
            {["40 0000 km", "30 000km", "20 000km", "0"].map(
              (stepNumber: string, index) => {
                return (
                  <Text
                    style={{
                      fontSize: 9,
                      height: "30%",
                      marginRight: 5,
                      lineHeight: 9,
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 1)",
                      textAlign: "right",
                      transform: [{ translateY: 9 / 2 }],
                    }}
                  >
                    {stepNumber}
                  </Text>
                );
              }
            )}
          </View>
        </View>
        <View style={{ width: "90%", height: "100%" }}>
          <Graphs
            state={state}
            transition={transition}
            parentSize={{
              width: 0,
              height: 0,
            }}
            steps={steps}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Indicator state={state} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  steps: {
    width: "15%",
    height: "100%",
  },
  footer: {
    paddingLeft: "15%",
    height: 40,
  },
  scaleTimeLabel: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "white",
    textAlign: "center",
  },
});
