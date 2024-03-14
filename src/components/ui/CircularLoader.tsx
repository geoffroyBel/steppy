import {
  Canvas,
  Fill,
  Group,
  Path,
  PathOp,
  Rect,
  Shadow,
  SkPoint,
  Skia,
  SweepGradient,
  useFont,
  vec,
  Text,
} from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { View, Text as RNText } from "react-native";

interface IProps {
  radius: number;
  steps: number;
  progress: SharedValue<number>;
  caption: string;
  trim: SharedValue<number>;
}

const getArcPath = (
  center: SkPoint,
  r: number,
  start: number,
  end: number,
  close = true
) => {
  const { x1, y1, x2, y2 } = calcArcPoint(center, r, start, 0);
  const { x2: x4, y2: y4 } = calcArcPoint(center, r, 0, Math.PI);
  const { x2: x6, y2: y6 } = calcArcPoint(center, r, 0, end);
  const p1 = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} A ${r} ${r} 0 0 1 ${x4} ${y4} A ${r} ${r} 0 0 1 ${x6} ${y6}`;

  return Skia.Path.MakeFromSVGString(close ? `${p1} Z` : p1)!;
};

const calcArcPoint = (
  center: SkPoint,
  r: number,
  start: number,
  end: number
) => {
  const x1 = center.x - r * Math.cos(start);
  const y1 = -r * Math.sin(start) + center.y;
  const x2 = center.x - r * Math.cos(end);
  const y2 = -r * Math.sin(end) + center.y;
  return { x1, y1, x2, y2 };
};
const FONT_SIZE_BOLD = 47;
const FONT_SIZE_REGULAR = 14;
const TOTAL_STEPS = 10000;
export default ({
  radius,
  progress,
  caption = "Pas réalises",
  steps = 8000,
}: IProps) => {
  const t = useSharedValue(0.5);
  const w = radius * 2;
  const h = radius + radius / 3;
  const fontBold = useFont(
    require("../../../assets/font/Montserrat-SemiBold.otf"),
    FONT_SIZE_BOLD
  )!;
  const fontRegular = useFont(
    require("../../../assets/font/Montserrat-Regular.otf"),
    FONT_SIZE_REGULAR
  )!;

  const text = useDerivedValue(() => {
    const str = Math.round(progress.value * 10000);
    // return `${Array(5 - `${p}`.length)
    //   .fill("0")
    //   .join("")}${p}`;
    return `${str}`;
  }, [progress]);
  const positionBold = useDerivedValue(() => {
    const m = Skia.Matrix();
    if (!fontBold) return m;
    const progressString = `${Math.round(progress.value * 10000)}`;
    const x = (w - fontBold.getTextWidth(progressString)) / 2;
    const y = (w + FONT_SIZE_BOLD / 2) / 2;

    m.translate(x, y);
    return m;
    // return { x, y };
  }, [fontBold, w, progress]);

  const positionCaption = useMemo(() => {
    if (!fontRegular) return { x: radius / 2, y: radius / 2 };
    const x = (w - fontRegular.getTextWidth(caption)) / 2;
    const y = (w - FONT_SIZE_REGULAR) / 2 - FONT_SIZE_BOLD / 2;
    return { x, y };
  }, [fontRegular, w]);

  //   useEffect(() => {
  //     trim.value = withTiming(progress, { duration: 2000 });
  //   }, [trim]);

  const clip = useMemo(() => {
    const center = vec(radius, radius);
    const r = radius;

    let start = Math.atan2(-radius / 3, -radius * -1);
    let end = Math.atan2(-radius / 3, radius * -1);

    const outerPath = getArcPath(center, r, start, end);
    const innerPath = getArcPath(center, r - 20, start - 0.5, end + 0.5);
    return Skia.Path.MakeFromOp(outerPath, innerPath, PathOp.Difference)!;
  }, []);

  const path = useMemo(() => {
    const strokeWidth = 20;

    const center = vec(radius, radius);
    const r = radius;

    let start = Math.atan2(-radius / 2, -radius * -1);
    let end = Math.atan2(-radius / 2, radius * -1);

    const innerPath = getArcPath(center, r - 10, start, end, false);
    return innerPath;
  }, []);

  const matrix = useMemo(() => {
    const m = Skia.Matrix();
    const angle = Math.PI;

    m.rotate(angle);

    return m;
  }, [clip]);

  return (
    <View style={{ width: w, paddingBottom: 18}}>
      <Canvas
        style={{
          width: w,
          height: h,
        }}
      >
        <Group clip={clip}>
          <Rect x={0} y={0} width={w} height={w} color={"black"}>
            <SweepGradient
              origin={vec(radius, radius)}
              colors={[
                "rgba(0, 95, 171, 0.2)",
                "rgba(0, 95, 171, 0.5)",
                "rgba(0, 95, 171, 0.2)",
              ]}
              start={0}
              end={180}
              c={vec(radius, radius - radius / 2 + 5)}
              matrix={matrix}
            />
          </Rect>

          <Path
            path={path}
            start={0}
            end={progress}
            style={"stroke"}
            strokeWidth={20}
          >
            <SweepGradient
              origin={vec(radius, radius)}
              colors={[
                "rgba(0, 95, 171, 0.5)",
                "rgba(0, 95, 171, 0.7)",
                "rgba(0, 95, 171, 1)",
              ]}
              start={0}
              end={180}
              c={vec(radius, radius - radius / 2 + 5)}
              matrix={matrix}
            />
          </Path>
        </Group>
        <Group>
          <Shadow dx={1} dy={1} blur={1} color={"black"} />
          <Text
            x={positionCaption.x}
            y={positionCaption.y}
            text={caption}
            font={fontRegular}
            color={"rgba(4, 47, 82, 1)"}
          />
          <Text
            matrix={positionBold!}
            // x={positionBold.x}
            // y={positionBold.y}
            text={text}
            font={fontBold}
            color={"rgba(0, 95, 171, 1)"}
          />
        </Group>
      </Canvas>
      <RNText
        style={{
          fontFamily: "Montserrat",
          fontWeight: "800",
          fontSize: 18,
          textAlign: "center",
          lineHeight: 21,
          color: "rgba(0, 95, 171, 1)",
        }}
      >
        {TOTAL_STEPS - steps}{" "}
        <RNText
          style={{
            fontFamily: "Montserrat",
            fontWeight: "600",
            fontSize: 18,
            textAlign: "center",
            lineHeight: 21,
            color: "rgba(4, 47, 82, 1)",
          }}
        >
          pas restants
        </RNText>
      </RNText>
    </View>
  );
};
