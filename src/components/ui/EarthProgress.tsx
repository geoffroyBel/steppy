import {
  Canvas,
  useImage,
  Image,
  Mask,
  Group,
  Rect,
  useFont,
  Text,
  Circle,
  vec,
  center,
} from "@shopify/react-native-skia";
import { View } from "react-native";
import {
  SharedValue,
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";
interface IEarthProgress {
  progress: number;
  transition: SharedValue<number>;
}
const SIZE = 150;
const STROKE_WIDTH = 15;
const EARTH_SIZE = SIZE - STROKE_WIDTH;
const RADIUS = SIZE / 2;
const INNER_RADIUS = SIZE - STROKE_WIDTH;
const CENTER = vec(STROKE_WIDTH / 2, STROKE_WIDTH / 2);
export default ({ transition, progress = 0.6 }: IEarthProgress) => {
  const image = useImage(require("../../../assets/earth.png"));
  const image2 = useImage(require("../../../assets/earth2.png"));
  const font = useFont(
    require("../../../assets/font/Montserrat-SemiBold.otf"),
    35
  )!;
  const text = useDerivedValue(() => {
    return `${Math.round(transition.value * (progress * 100))}%`;
  }, [transition]);
  const textX = useDerivedValue(() => {
    if (!font) return SIZE / 2;
    return SIZE / 2 - font.getTextWidth(text.value) / 2;
  }, [text, font]);
  const maskY = useDerivedValue(() => {
    return interpolate(
      transition.value * progress,
      [0, 1],
      [SIZE, STROKE_WIDTH / 2]
    );
  }, [transition]);

  return (
    <Canvas
      style={{
        width: SIZE,
        height: SIZE,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Circle
        cx={RADIUS}
        cy={RADIUS}
        r={RADIUS}
        color="rgba(17, 109, 179, 0.15)"
      />
      <Image
        image={image2}
        fit="contain"
        x={CENTER.x}
        y={CENTER.y}
        width={EARTH_SIZE}
        height={EARTH_SIZE}
      />
      <Mask
        mask={
          <Group>
            <Rect
              x={CENTER.x}
              y={maskY}
              width={EARTH_SIZE}
              height={EARTH_SIZE}
              color="lightblue"
            />
          </Group>
        }
      >
        <Image
          image={image}
          fit="contain"
          x={CENTER.x}
          y={CENTER.y}
          width={EARTH_SIZE}
          height={EARTH_SIZE}
        />
      </Mask>

      <Text
        x={textX}
        y={SIZE / 2 + 10}
        text={text}
        font={font}
        color={"white"}
      />
    </Canvas>
  );
};
