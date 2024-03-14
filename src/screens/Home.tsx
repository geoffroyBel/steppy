import { View, Text, StyleSheet, ScrollView, Alert, Linking } from "react-native";
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

import { PermissionsAndroid } from 'react-native';
import HomeCard from "../components/Home/HomeCard";
import { getGrantedPermissions, openHealthConnectDataManagement, requestPermission } from "react-native-health-connect";

export default () => {
  const { handleFetchDaily } = useContext<IStepContext>(StepContext);
  const transition = useSharedValue(0);
  const podometer = Podometer();
  useEffect(() => {
    // async function requestHealthPermission() {
    //   try {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
    //       {
    //         title: 'Health Data Access',
    //         message: 'App needs access to your steps data.',
    //         buttonNeutral: 'Ask Me Later',
    //         buttonNegative: 'Cancel',
    //         buttonPositive: 'OK',
    //       },
    //     );
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //       console.log('You can access the steps data');
    //     } else {
    //       console.log('Permission denied');
    //     }
    //   } catch (err) {
    //     console.warn(err);
    //   }
    // }

    // requestHealthPermission();
    // Check if the user has already granted the permission
    const checkPermission = async () => {
      try {
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        );
        if (result) {
          console.log('Permission is already granted');
          return true
        } else {
          console.log('Permission is not granted');
          return false
        }
      } catch (err) {
        console.warn(err);
      }
    }
    let a = null;
    // Wait for the reply of the permission request to cast to a boolean
    (async function () {
      a = await checkPermission();
      if (!a) {
        // Alert the user that the permission is not granted and that the must grant it in Health Connect with a pop-up
        Alert.alert(
          "Permission requise",
          "Pour accéder à vos données de podomètre, vous devez autoriser l'accès à la santé dans les paramètres de votre téléphone.",
          [
            {
              text: "Voir les paramètres",
              onPress: () => {
                // Send the user to the settings of the phone to change the permission:
                Linking.openSettings();
              },
            },
            {
              text: "Ok",
              style: "cancel",
            },
          ]
        );
      }

    }
    )();
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
  useEffect(() => console.log(podometer, "podometer"), [podometer]);

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

        <View style={styles.homeCardContainer}>
          <HomeCard
            title="Nombre de pas total du CHU"
            value={"1145000"} icon={require("../../assets/steps.png")} />
          <HomeCard
            title="Ton classement actuel"
            value={"1er !"} icon={require("../../assets/ranking.png")} />
          <HomeCard
            title="Moyenne de tes pas cette semaine"
            value={"10000"} icon={require("../../assets/average.png")} />
          <HomeCard
            title="Jours consécutifs à plus de 10 000 pas"
            value={"1"} icon={require("../../assets/flame.png")} />
        </View>

      </ScrollView >
    </View >
  );
};

const styles = StyleSheet.create({
  header: {
    height: 500,
    width: "100%",
  },
  homeCardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    flexWrap: "wrap",
    paddingBottom: 50,
  },
});
