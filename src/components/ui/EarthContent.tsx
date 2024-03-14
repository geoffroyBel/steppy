import { Canvas, Text as SKText, useFont } from "@shopify/react-native-skia";
import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Message from "./Message";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
const { width } = Dimensions.get("screen");
interface IEartContent {
  totalStep: number;
  objectif: number;
  message: string;
  transition: SharedValue<number>;
}

export default ({ totalStep, objectif, message, transition }: IEartContent) => {
  const scale = useSharedValue(0);
  const [show, setShow] = useState(false);
  const font = useFont(
    require("../../../assets/font/Montserrat-SemiBold.otf"),
    35
  )!;
  const restants = useMemo(() => objectif - totalStep, [objectif, totalStep]);
  const text = useDerivedValue(() => {
    return `${Math.round(transition.value * totalStep)}`;
  }, [transition, totalStep]);
  const textX = useDerivedValue(() => {
    if (!font) return width / 2;
    return (width - font.getTextWidth(text.value)) / 2;
  }, [font]);
  useAnimatedReaction(
    () => transition.value, // La dépendance à surveiller
    (newValue, prevValue) => {
      if (newValue === 1) {
        scale.value = withTiming(1, { duration: 1000 }, () => {
          runOnJS(setShow)(true);
        });
      }
    }
  );
  useEffect(() => {
    return () => {
      setShow(false);
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      transition.value = 0;
      transition.value = withTiming(1, {
        duration: 2000,
      });
      return () => {
        setShow(false);
      };
    }, [])
  );
  const styleTotal = useAnimatedStyle(() => {
    const opacity = interpolate(transition.value, [0, 0.5], [0, 1]);
    return {
      opacity,
    };
  });
  const styleRestants = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  return (
    <View style={styles.container}>
      <Text style={styles.static}>Pas réalisés</Text>
      <View style={styles.textContainer}>
        <Animated.View style={styleTotal}>
          <Canvas style={{ width: "100%", height: 27 }}>
            <SKText
              x={textX}
              y={35 - 10}
              text={text}
              font={font}
              color="rgba(0, 95, 171, 1)"
            ></SKText>
          </Canvas>
        </Animated.View>
        <Animated.View style={styleRestants}>
          <Text style={styles.objectif}>
            {`${restants} `}{" "}
            <Text style={{ fontWeight: "500", color: "rgba(4, 47, 82, 1)" }}>
              {"pas restants"}
            </Text>
          </Text>
        </Animated.View>
        <Message content={message} isSelected={show} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    rowGap: 5,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
  },
  static: {
    fontFamily: "Montserrat",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 14,
    color: "rgba(4, 47, 82, 1)",
  },
  total: {
    fontFamily: "Montserrat",
    fontWeight: "900",
    fontSize: 35,
    textAlign: "center",
    lineHeight: 43,
    color: "rgba(0, 95, 171, 1)",
  },
  objectif: {
    fontFamily: "Montserrat",
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 19,
    color: "rgba(0, 95, 171, 1)",
  },
});
