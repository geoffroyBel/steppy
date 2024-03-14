import { View, StyleSheet, Text, Dimensions } from "react-native";
import Days from "./Day";
import CircularLoader from "./CircularLoader";
import Slides from "./Slides";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
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
import { StepContext } from "../../Providers/StepProvider";
import { IStepContext } from "../../types";
import { OBJECTIF, getObjectifByStep } from "../../utils/challenge";
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
  const transitionMsg = useSharedValue(0);
  const transition = useSharedValue(0);
  const { totalSteps } = useContext(StepContext) as IStepContext;
  const progress = useSharedValue(0);

  useEffect(() => {
    if (totalSteps > 0) {
      progress.value = totalSteps / OBJECTIF.terre.steps;
    }
  }, [totalSteps]);
  useFocusEffect(
    React.useCallback(() => {
      if (totalSteps > 0) {
        progress.value = totalSteps / OBJECTIF.terre.steps;
        transition.value = 0;
        transitionMsg.value = 0;
        transitionMsg.value = withTiming(1, { duration: 1000 }, () => {
          transition.value = withTiming(1, { duration: 1000 });
        });
      }

      () => {
        transition.value = 0;
        transitionMsg.value = 0;
      };
    }, [totalSteps])
  );

  const style = useAnimatedStyle(() => {
    const scale = interpolate(transitionMsg.value, [0, 1], [0, 1]);
    return {
      transform: [{ scale: scale }],
    };
  });
  return (
    <View style={styles.background}>
      <View style={styles.container} />
      <View style={{ height: insets.top }} />
      <EarthHeader caption={"Objectif"} title={"Planète Terre"} />
      <Animated.View
        style={[
          {
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
          style,
        ]}
      >
        <EarthProgress progress={progress} transition={transition} />
      </Animated.View>

      <EarthContent
        totalStep={totalSteps}
        objectif={OBJECTIF.terre.steps}
        message={getObjectifByStep(totalSteps).message}
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
