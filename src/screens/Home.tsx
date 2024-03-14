import { View, Text, StyleSheet, ScrollView, Alert, Linking, ActivityIndicator } from "react-native";
import Graphs from "../components/ui/Graphs";
import Podometer from "../podometer/Podometer";
import { useContext, useEffect, useMemo, useState } from "react";
import { DataPoint, IStepContext, Steps } from "../types";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import ChallengeCard from "../components/ui/ChallengeCard";
import { Canvas, Fill, LinearGradient, vec } from "@shopify/react-native-skia";
import ObjectifCard from "../components/ui/ObectifCard";
import { StepContext } from "../Providers/StepProvider";
import HomeCard from "../components/Home/HomeCard";
import { getGrantedPermissions, openHealthConnectDataManagement, requestPermission } from "react-native-health-connect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Providers/AuthProvider";
import { getAllBadgeIndividual } from "../store/actions/badgeData";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();
export default () => {
  const { handleFetchDaily } = useContext<IStepContext>(StepContext);
  const transition = useSharedValue(0);
  const podometer = Podometer();
  const [isLoading, setIsLoading] = useState(true);
  const [podometerData, setPodometerData] = useState<DataPoint[] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('podometerData');
        if (storedData) {
          setPodometerData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Failed to load data', error);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchAndStoreData = async () => {
      if (!handleFetchDaily) return;
      const data = await handleFetchDaily({ from: '2023-03-05', to: '2023-03-08' });
      try {
        await AsyncStorage.setItem('podometerData', JSON.stringify(data));
        if (data !== null) {
          setPodometerData(data);
        }
      } catch (error) {
        console.error('Failed to save data', error);
      }
    };

    if (isLoading) {
      fetchAndStoreData();
    }
  }, [isLoading, handleFetchDaily]);
  useEffect(() => {
    // Check if the user has already granted the permission
    const checkPermission = async () => {
      // Get the list of granted permissions
      const grantedPermissions = await getGrantedPermissions();
      // Check if the permission is in the list of granted permissions
      // Considering the returned object looks like this: [{"accessType": "read", "recordType": "Steps"}] 
      return grantedPermissions.some((permission) => permission.recordType === "Steps");
    };
    let a = null;
    // Wait for the reply of the permission request to cast to a boolean
    (async function () {
      a = await checkPermission();
      if (!a) {
        // console.log("requesting permission", a);
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
  }, []);
  // const steps: Steps = podometer.steps;
  const currentWeekSteps = useMemo(() => {
    return podometer && podometer.steps && podometer.steps.week
      ? podometer.steps.week.map((el, i) => {
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

  // Get the total amount of steps of the user walked in the last 7 days
  let individualTotalSteps = 0;
  if (podometer && podometer.steps && podometer.steps.week) {
    individualTotalSteps = podometer.steps.week.reduce((acc, el) => acc + el.value, 0);
  }
  // Average it for 7 days with a Math.round to get a whole number
  const averageSteps = Math.round(individualTotalSteps / 7);
  const { totalSteps } = useContext(
    StepContext
  ) as IStepContext;

  const user = useContext(AuthContext)
  const [badgeCount, setBadgeCount] = useState(0);
  // Get the users badges to get their total amount
  useEffect(() => {
    const fetchDataAllBadge = async () => {
      try {
        const data = await getAllBadgeIndividual();
        // Make sure the user has all the badges before counting them
        setBadgeCount(0);
        data.forEach((badge) => {
          const quantity = badge.quantity;
          if (individualTotalSteps >= quantity) {
            setBadgeCount((prev) => prev + 1);
          }
        })
      } catch (error) {
        console.error("Failed to fetch all badge data:", error);
      }
    };
    fetchDataAllBadge();
    const streak = 0
    if (podometer && podometer.steps) {
      const steps = podometer.steps.week;
      let streak = 0;
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].value >= 10000) {
          streak++;
        } else {
          break;
        }
      }
    }
    setStreakCount(streak);
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // Calculate user's streak
  const [streakCount, setStreakCount] = useState(0);
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
                1: "Dommage tu feras mieux demain",
                2: "Dommage tu feras mieux demain",
                3: "Dommage tu feras mieux demain",
                4: "Dommage tu feras mieux demain",
                5: "Dommage tu feras mieux demain",
                // 6: "Felicitations des petit pas c bien",
                // 7: "Les 10 000 pas ne sont peut-être pas encore là, mais chaque pas te rapproche de ton objectif",
              }}
            />
          </View>
        </Animated.View>
        {/*  */}

        {podometer && podometer.steps && <Graphs steps={podometer.steps} />}

        <View style={styles.homeCardContainer}>
          <HomeCard
            title="Nombre de pas total du CHU"
            value={totalSteps.toString()} icon={require("../../assets/steps.png")} />
          <HomeCard
            title="Nombre de badges obtenus"
            value={badgeCount.toString()}
            icon={require("../../assets/ranking.png")} />
          <HomeCard
            title="Moyenne de tes pas cette semaine"
            value={averageSteps.toString()} icon={require("../../assets/average.png")} />
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
    // height: 500,
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
