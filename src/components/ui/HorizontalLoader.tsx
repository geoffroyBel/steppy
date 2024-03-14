import {
  Canvas,
  Fill,
  Group,
  LinearGradient,
  Rect,
  RoundedRect,
  Skia,
  rect,
  rrect,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import {
  SharedValue,
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";
interface Iprops {
  transition?: SharedValue<number>;
  width: number;
  height: number;
  progress: number;
}
export default ({ width, height, progress, transition }: Iprops) => {
  const roundedRect = rrect(rect(0, 0, width, height), height / 2, height / 2);
  const path = useMemo(() => {}, []);
  const matrix = useDerivedValue(() => {
    const m = Skia.Matrix();
    if (!transition) return m;
    m.scale(transition!.value * progress);
    return m;
  }, [transition]);
  const progressFloat = progress/100;
  return (
    <Canvas style={{ width, height }}>
      <Group clip={roundedRect}>
        <Fill color={"rgba(217, 217, 217, 1)"} />
        <RoundedRect
          x={0}
          y={0}
          width={width * progressFloat} 
          height={height}
          r={height / 2}
          matrix={matrix}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, 0)}
            colors={["rgba(27, 184, 235, 1)", "rgba(0, 95, 171, 1)"]}
          />
        </RoundedRect>
      </Group>
    </Canvas>
  );
};
