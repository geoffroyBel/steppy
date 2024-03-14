import { View, Text, StyleSheet, ScrollView } from "react-native";
import Graphs from "../components/ui/Graphs";
import Podometer from "../podometer/Podometer";
import { useContext, useEffect, useMemo } from "react";
import { IStepContext, Steps } from "../types";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import ChallengeCard from "../components/ui/ChallengeCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Canvas, Fill, LinearGradient, vec } from "@shopify/react-native-skia";
import ObjectifCard from "../components/ui/ObectifCard";
import { StepContext } from "../Providers/StepProvider";

export default () => {
  const { handleFetchDaily } = useContext<IStepContext>(StepContext);
  const transition = useSharedValue(0);
  const podometer = Podometer();

  useEffect(() => {
    const fetchDaily = async () => {
      if (!handleFetchDaily) return;

      await handleFetchDaily({ from: "2023-03-05", to: "2023-03-08" });
    };
    fetchDaily();
    //getPodometerStep?.({ from: "2023-03-05", to: "2023-03-08" });
  });
  // const steps: Steps = podometer.steps;
  const currentWeekSteps = useMemo(() => {
    return podometer && podometer.steps && podometer.steps.week
      ? podometer.steps.week.map((el) => {
          return {
            ...el,
            date: new Date(el.date),
            progress: el.value > 10000 ? 1 : el.value / 10000,
          };
        })
      : [];
  }, [podometer]);
  useEffect(() => {
    transition.value = withTiming(1, { duration: 3000 });
  }, [podometer]);

  return (
    <View style={{ flex: 1 }}>
      <View style={[StyleSheet.absoluteFillObject]}>
        <Canvas style={{ flex: 1 }}>
          <Fill>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(390, 0)}
              colors={["rgba(57, 143, 199, 1)", "rgba(1, 96, 172, 1)"]}
            />
          </Fill>
        </Canvas>
      </View>

      <ScrollView
        bounces={true}
        showsVerticalScrollIndicator={true}
        snapToOffsets={[0, 500]}
        snapToEnd={false}
        decelerationRate="fast"
      >
        <Animated.View>
          <View style={styles.header}>
            <ChallengeCard
              steps={currentWeekSteps}
              messages={{
                1: "Les 10 000 pas ne sont peut-être pas encore là, mais chaque pas te rapproche de ton objectif",
                6: "Felicitations des petit pas c bien",
                3: "Les 10 000 pas ne sont peut-être pas encore là, mais chaque pas te rapproche de ton objectif",
              }}
            />
          </View>
        </Animated.View>
        {/*  */}

        {podometer && podometer.steps && <Graphs steps={podometer.steps} />}

        <ObjectifCard
          objectifs={[
            { id: 1, progress: 0.6 },
            { id: 1, progress: 0.8 },
          ]}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 500,
    width: "100%",
  },
});
