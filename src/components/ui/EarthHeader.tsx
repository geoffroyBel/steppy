import {
  Canvas,
  LinearGradient,
  RoundedRect,
  Shadow,
  SkPoint,
  Text,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { Dimensions } from "react-native";
import { useDerivedValue } from "react-native-reanimated";
const { width } = Dimensions.get("screen");
interface IEarthHeader {
  caption: string;
  title: string;
}
const FONT_TITLE = 30;
const FONT_CAPTION = 12;
const WIDTH = 290;
const HEIGHT = 64;
const MARGIN = 20;
const CARD_POINT = vec((width - WIDTH) / 2, MARGIN / 2);
export default ({ caption, title }: IEarthHeader) => {
  const font = useFont(
    require("../../../assets/font/Montserrat-SemiBold.otf"),
    FONT_TITLE
  )!;
  const font2 = useFont(
    require("../../../assets/font/Montserrat-Regular.otf"),
    FONT_CAPTION
  )!;
  const titleVec = useMemo<SkPoint>(() => {
    if (!font) return vec(WIDTH / 2, MARGIN / 2);
    const x = (width - font.getTextWidth(title)) / 2;
    const y = 60;
    return vec(x, y);
  }, [font, title]);
  const captionVec = useMemo<SkPoint>(() => {
    if (!font) return vec(WIDTH / 2, MARGIN / 2);
    const x = (width - font2.getTextWidth(caption)) / 2;
    const y = 60 - FONT_CAPTION * 2.5;
    return vec(x, y);
  }, [font2, caption]);

  return (
    <Canvas
      style={{
        width,
        height: HEIGHT + MARGIN,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RoundedRect
        x={CARD_POINT.x}
        y={CARD_POINT.y}
        width={WIDTH}
        height={HEIGHT}
        r={10}
      >
        <LinearGradient
          start={vec(width / 2, 0)}
          end={vec(width, 0)}
          colors={["rgba(0, 95, 171, 1)", "rgba(27, 184, 235, 1)"]}
        />
        <Shadow dx={0} dy={4} blur={4} color={"rgba(0, 0, 0, 0.5)"} />
      </RoundedRect>
      <Text
        x={titleVec.x}
        y={titleVec.y}
        text={title}
        font={font}
        color={"white"}
      />
      <Text
        x={captionVec.x}
        y={captionVec.y}
        text={caption}
        font={font2}
        color={"white"}
      />
    </Canvas>
  );
};
