import { View, StyleSheet, Image, Text, Pressable } from "react-native";
import CircleLoader from "./CircleLoader";
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useEffect, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
interface IDay {
  transition?: SharedValue<number>;
  progress: number;
  date: string;
  onPress?: () => void;
  selectedDay?: SharedValue<number>;
  index: number;
}
interface IDays {
  onPress?: (index: number) => void;
  days: Array<{ progress: number; date: string }>;
  selectedDay: SharedValue<number>;
  transition: SharedValue<number>;
}
const styles = StyleSheet.create({
  root: {
    height: 70,
    width: 30,

    justifyContent: "space-between",
  },
  header: {
    height: 12,
    width: 30,
  },
  main: {
    height: 30,
    width: 30,
  },
  footer: {
    height: 15,
    width: 30,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export const Day = ({
  transition,
  progress,

  date,
  onPress,
  selectedDay,
  index,
}: IDay) => {
  const color = useAnimatedStyle(() => {
    const color = interpolateColor(
      selectedDay?.value || 0,
      [index - 1, index, index + 1],
      ["rgba(4, 47, 82, 1)", "rgba(0, 95, 171, 0.5)", "rgba(4, 47, 82, 1)"]
    );
    return {
      color,
    };
  }, [selectedDay]);

  return (
    <Pressable
      onPress={() => {
        // (translateX.value = withTiming(index * w))
        onPress?.();
      }}
      style={styles.root}
    >
      <View style={styles.header}>
        {progress > 0.8 && (
          <Image
            source={require("../../../assets/icons/crown.png")}
            style={{
              width: 15,
              height: 15,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        )}
      </View>
      <View style={styles.main}>
        <CircleLoader
          width={30}
          progress={progress}
          strokeWidth={4}
          transition={transition || { value: 1 }}
        />
      </View>
      <View style={styles.footer}>
        <Animated.Text
          style={[
            {
              fontFamily: "Montserrat",
              fontWeight: "600",
              fontSize: 10,
              lineHeight: 12,
              textAlign: "center",
              transform: [{ translateY: -5 }],
              color: "rgba(4, 47, 82, 1)",
            },
            color,
          ]}
        >
          {date}
        </Animated.Text>
      </View>
    </Pressable>
  );
};
export default ({ days, onPress, selectedDay, transition }: IDays) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: insets.top,
      }}
    >
      {days.map((day, key) => {
        return (
          <Day
            index={key}
            selectedDay={selectedDay}
            onPress={() => onPress?.(key)}
            {...{ key }}
            progress={day.progress}
            date={DAYS[key]}
            transition={transition}
          />
        );
      })}
    </View>
  );
};
