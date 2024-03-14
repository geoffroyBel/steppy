import { View, Text, StyleSheet, ScrollView } from "react-native";
import Graphs from "../components/ui/GraphChallenge";
import Podometer from "../podometer/Podometer";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  DailySteps,
  DataPoint,
  IChallenge,
  IStepContext,
  Steps,
} from "../types";
import Animated, {
  useSharedValue,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import ChallengeCard from "../components/ui/ChallengeCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Canvas, Fill, LinearGradient, vec } from "@shopify/react-native-skia";
import ObjectifCard from "../components/ui/ObectifCard";
import ChallengeChuCard from "../components/ui/ChallengeChuCard";
import { getStats } from "../store/actions/stats";
import {
  OBJECTIF,
  getCurrentMonthDailySteps,
  getCurrentWeekDailySteps,
} from "../utils/challenge";
import StepProvider, { StepContext } from "../Providers/StepProvider";
import { getDatesbyRange, getMonthBound } from "../utils/dateUtils";
import dayjs from "dayjs";

export default () => {
  const transition = useSharedValue(0);
  const podometer = Podometer();
  const { totalSteps, handleFetchStats, stats } = useContext(
    StepContext
  ) as IStepContext;
  const [steps, setSteps] = useState<Partial<Steps>>();
  const [target, setTarget] = useState([
    { id: 4, progress: 0 },
    { id: 3, progress: 0 },
    { id: 2, progress: 0 },
  ]);

  useEffect(() => {
    if (stats) {
      const week = getCurrentWeekDailySteps(stats.weekSteps as DailySteps[]);
      const month = getCurrentMonthDailySteps(stats.monthSteps as DailySteps[]);
      setSteps({ week, month });
    }
  }, [stats]);

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
            <ChallengeChuCard />
          </View>
        </Animated.View>
        {/*  */}
        <View style={{ gap: 20 }}>
          <ObjectifCard
            objectifs={[
              { id: 4, progress: totalSteps / OBJECTIF.terre.steps },
              { id: 3, progress: totalSteps / OBJECTIF.europe.steps },
              {
                id: 2,
                progress:
                  totalSteps / OBJECTIF.france.steps > 1
                    ? 1
                    : totalSteps / OBJECTIF.france.steps,
              },
            ]}
          />
          <Graphs steps={steps as Steps} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 600,
    width: "100%",
  },
});
