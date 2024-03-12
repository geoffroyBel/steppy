import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { View, StyleSheet, Dimensions, Text, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import Svg, { Defs, Rect, LinearGradient, Stop, Path } from "react-native-svg";
import NavBar from "./ui/NavBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { height, width } = Dimensions.get("screen");
const AnimatedPath = Animated.createAnimatedComponent(Path);
const HEADER_HEIGHT = 0.4 * height;
const p1 = { x: 0 - 50, y: 0.3 * HEADER_HEIGHT };
const p2 = { x: width + 50, y: 0.3 * HEADER_HEIGHT };
const c1 = { x: 0.1 * width, y: 0.3 * HEADER_HEIGHT };
const c2 = { x: 0.9 * width, y: 0.3 * HEADER_HEIGHT };
const FROM_COLOR = "rgb(23, 99, 174)";
const TO_COLOR = "rgb(34,121,190)";
export default () => {
  const radius = useSharedValue(HEADER_HEIGHT);
  const scale = useSharedValue(0);
  const insets = useSafeAreaInsets();
  useFocusEffect(
    useCallback(() => {
      scale.value = 0;
      radius.value = p1.y;
      radius.value = withTiming(HEADER_HEIGHT, { duration: 1000 }, () => {
        scale.value = withTiming(1);
      });
    }, [])
  );
  const animatedProps = useAnimatedProps(() => {
    // draw a circle
    console.log(insets.top);

    const gap = 0;
    const path = `
      M ${p1.x}, ${p1.y + gap}
      C ${c1.x}, ${radius.value} ${c2.x}, ${radius.value} ${p2.x}, ${
      p2.y + gap
    } L ${width} ${0} L 0,0 Z
      `;
    return {
      d: path,
    };
  });
  const styleScale = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, []);
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Svg style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor={FROM_COLOR} />
              <Stop offset="1" stopColor={TO_COLOR} />
            </LinearGradient>
          </Defs>
          <AnimatedPath animatedProps={animatedProps} fill="url(#grad)" />
        </Svg>
        <View style={{ marginTop: insets.top }} />
        <NavBar />

        <Animated.View style={[styles.avatar, styleScale]}>
          <Image source={require("../../../assets/avatar.png")} />
        </Animated.View>
      </View>
      <View style={styles.main}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
  },
  main: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: "Montserrat",
    fontWeight: "400",
    fontSize: 24,
    color: "black",
  },
  avatar: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: 100,
  },
});
