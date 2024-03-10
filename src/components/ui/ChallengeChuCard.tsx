import { View, StyleSheet, Text, Dimensions } from "react-native";
import Days from "./Day";
import CircularLoader from "./CircularLoader";
import Slides from "./Slides";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Messages from "./Messages";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Message from "./Message";
import EarthHeader from "./EarthHeader";
import EarthProgress from "./EarthProgress";
import EarthContent from "./EarthContent";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
const { width } = Dimensions.get("screen");
interface IChallenge {
  steps: Array<Step>;
  messages: {
    [key: number]: string;
  };
}
type Step = { date: string; progress: number };
export interface IChallengeMessage {
  index: number;
  messages: string;
}
export default () => {
  const insets = useSafeAreaInsets();
  const transition = useSharedValue(0);
  const state = useSharedValue({
    daysProgress: [0, 0, 0, 0, 0, 0, 0],
  });
  const input = new Array(7).fill(0).map((l, i) => i * width);
  useEffect(() => {
    console.log("kkkkkkkkalloc");

    transition.value = 0;
    transition.value = withTiming(1, { duration: 2000 });
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      transition.value = 0;
      transition.value = withTiming(1, { duration: 2000 });
    }, [])
  );
  return (
    <View style={styles.background}>
      <View style={styles.container} />
      <View style={{ height: insets.top }} />
      <EarthHeader caption={"Objectif"} title={"Planète Terre"} />
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <EarthProgress progress={0.8} transition={transition} />
      </View>

      <EarthContent
        totalStep={500000}
        objectif={1000000}
        message={"Bravo vouz avez atteint tokyo"}
        transition={transition}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: "relative",

    gap: 20,
    paddingBottom: 105,
  },
  container: {
    backgroundColor: "white",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    ...StyleSheet.absoluteFillObject,
  },
});
