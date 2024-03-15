import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  Fill,
  Canvas,
  Skia,
  vec,
  Group,
  SkPoint,
  PathOp,
  Circle,
  Path,
  mix,
} from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";

interface ICircleLoader {
  width: number;
  progress: number;
  strokeWidth: number;
  transition: SharedValue<number>;
}
/// props={ value: 1}
export default ({
  strokeWidth,
  progress,
  transition,
  width = 100,
}: ICircleLoader) => {
  // size will be updated as the canvas size changes

  const center = useMemo(() => ({ x: width / 2, y: width / 2 }), [width]);

  const clip = useDerivedValue(() => {
    const outer_r = center.x;
    const inner_r = outer_r - strokeWidth;
    const inner = Skia.Path.Make();
    const outer = Skia.Path.Make();
    inner.addCircle(center.x, center.y, inner_r);
    outer.addCircle(center.x, center.y, outer_r);
    return Skia.Path.MakeFromOp(outer, inner, PathOp.Difference)!;
  }, [center]);
  const path = useMemo(() => {
    const outer_r = center.x - strokeWidth / 2;
    const outer = Skia.Path.Make()!;
    outer.addCircle(center.x, center.y, outer_r);
    return outer;
  }, [center]);
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = progress;
  });
  const end = useDerivedValue(() => {
    return mix(transition.value, 0, p.value);
  }, [transition, p]);

  return (
    <Canvas style={{ flex: 1 }}>
      <Group clip={clip}>
        <Fill color="rgba(0, 95, 171, 0.3)" />
        
        <Path
          origin={center}
          start={0}
          end={end}
          path={path}
          strokeWidth={strokeWidth}
          style={"stroke"}
          color={"rgba(0, 95, 171, 1)"}
          transform={[{ rotate: -Math.PI / 2 }]}
        />
      </Group>
    </Canvas>
  );
};
