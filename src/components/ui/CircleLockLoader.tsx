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
  mix
} from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
// import { image } from "d3";

interface ICircleLockLoader {
  width: number;
  progress: number;
  strokeWidth: number;
  // transition: SharedValue<number>;
  // image: string;
  isSelect: boolean;
}
/// props={ value: 1}
export default ({
  strokeWidth,
  progress,
  // transition,
  width = 100,
  isSelect,
}: ICircleLockLoader) => {
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
  let strokeColor = "rgba(128, 128, 128, 1)"; // Default gray color

  if (isSelect) {
    strokeColor = "rgba(0, 0, 128, 1)"; // Dark blue color when selected
  } else {
    if (progress === 1) {
      strokeColor = "rgba(173, 216, 230, 1)"; // Light blue color when progress is 1
    }
  }

  return (
    <Canvas style={{ flex: 1 }}>
      <Group clip={clip}>
        <Fill color="rgba(0, 95, 171, 0.3)" />
        <Path
          origin={center}
          start={0}
          // end={end}
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
