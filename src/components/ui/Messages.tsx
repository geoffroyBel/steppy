import {
  View,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
  Text,
} from "react-native";

import {
  ReactHTMLElement,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Canvas,
  Path,
  PathOp,
  Skia,
  rrect,
  useFont,
} from "@shopify/react-native-skia";
import Message from "./Message";
import { IChallengeMessage } from "./ChallengeCard";
const { width } = Dimensions.get("screen");
interface IMessages {
  messages: IChallengeMessage[];
  x: SharedValue<number>;
  currentIndex: number;
}
const styles = StyleSheet.create({
  root: {
    flex: 1,

    width: "100%",
  },
});
export default ({ messages, x, currentIndex }: IMessages) => {
  const [height, setHeight] = useState(0);
  const onLayout = (event: LayoutChangeEvent) => {
    const { height: h } = event.nativeEvent.layout;
    setHeight(h);
  };
  const visible = useMemo(() => (height !== 0 ? true : false), [height]);

  return (
    <View onLayout={onLayout} style={{ ...styles.root, height }}>
      {messages.map((msg) => {
        const { index, message: content } = msg;
        const style = useAnimatedStyle(() => {
          return {
            opacity: interpolate(
              x.value,
              [(index - 1) * width, index * width, (index + 1) * width],
              [0, 1, 0],
              Extrapolate.CLAMP
            ),
            // transform: [
            //   {
            //     scale: interpolate(
            //       x.value,
            //       [(index - 1) * width, index * width, (index + 1) * width],
            //       [0, 1, 0],
            //       Extrapolate.CLAMP
            //     ),
            //   },
            // ],
          };
        });
        return (
          <Animated.View style={[StyleSheet.absoluteFillObject /*, style*/]}>
            <Message content={content} isSelected={currentIndex === index} />
          </Animated.View>
        );
      })}
    </View>
  );
};
