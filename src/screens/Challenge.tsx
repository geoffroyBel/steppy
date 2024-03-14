import { View, Text, StyleSheet, ScrollView } from "react-native";
import Graphs from "../components/ui/Graphs";
import Podometer from "../podometer/Podometer";
import { useContext, useEffect, useMemo, useState } from "react";
import { IChallenge, IStepContext, Steps } from "../types";
import { useSharedValue, withTiming } from "react-native-reanimated";
import ChallengeCard from "../components/ui/ChallengeCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Canvas, Fill, LinearGradient, vec } from "@shopify/react-native-skia";
import ObjectifCard from "../components/ui/ObectifCard";
import ChallengeChuCard from "../components/ui/ChallengeChuCard";
import { getStats } from "../store/actions/stats";
import { OBJECTIF } from "../utils/challenge";
import StepProvider, { StepContext } from "../Providers/StepProvider";

export default () => {
  const transition = useSharedValue(0);
  const podometer = Podometer();
  const [stats, setStats] = useState<IChallenge>();
  const { totalSteps } = useContext(StepContext) as IStepContext;

  useEffect(() => console.log(podometer), [podometer]);
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     const _stats = await getStats();
  //     setTotalSteps(_stats.totalSteps / OBJECTIF.terre.steps);
  //     console.log(_stats.totalSteps);
  //   };

  //   fetchStats();
  // }, []);
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
        <View style={styles.header}>
          <ChallengeChuCard />
        </View>
        {/*  */}

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
