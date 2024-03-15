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
export default ({ steps, messages }: IChallenge) => {
  const [current, setCurrent] = useState(0);
  const scroll = useRef(null);
  const x = useSharedValue(0);
  const transition = useSharedValue(0);
  const state = useSharedValue({
    daysProgress: [0, 0, 0, 0, 0, 0, 0],
  });
  const input = new Array(7).fill(0).map((l, i) => i * width);
  useEffect(() => {
    const jour = new Date().getDay() === 0 ? 5 : new Date().getDay() - 1;
    x.value = jour * width;
  });
  useEffect(() => {
    state.value = {
      ...state.value,
      daysProgress: steps.map((el, i) => el.progress),
    };
    transition.value = 0;
    transition.value = withTiming(1, { duration: 2000 });
  }, [steps]);

  const p = useDerivedValue(() => {
    if (!state.value.daysProgress.length) return 0;
    return interpolate(x.value, input, state.value.daysProgress);
  }, [state]);

  const scrollToIndex = (index: number) => {
    scroll.current?.scrollTo(index * width);
  };
  const handleScrollEnd = (index: number) => {
    // console.log(index);
    setCurrent(index);
    // if (data[index].progress > 0.5) {
    //   confetti.current?.play();
    //   setIsMessageVisible(!isMessageVisible);
    // }
  };
  const selectedDay = useDerivedValue(() => {
    return x.value / width;
  }, [x]);

  // const progress = useDerivedValue(() => {
  //   if (!steps) return 0;
  //   return steps[parseInt(`${selectedDay.value}`)].progress;
  // }, [selectedDay, steps]);

  return (
    <View style={styles.background}>
      <View style={styles.container} />

      <Days
        transition={transition}
        selectedDay={selectedDay}
        onPress={scrollToIndex}
        days={steps}
      />

      <View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularLoader progress={p} trim={transition} radius={100} p={p} />
        </View>
      </View>
      <Slides
        ref={scroll}
        x={x}
        side={{ value: 0 }}
        onScrollEnd={handleScrollEnd}
        style={StyleSheet.absoluteFillObject}
      >
        {new Array(6).fill(0).map((_, i) => {
          return (
            <View
              style={{
                flex: 1,
                width,
                alignItems: "flex-end",
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              {messages[i + 1] && (
                <Message content={messages[i + 1]} isSelected={current == i} />
              )}
            </View>
          );
        })}
      </Slides>
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
