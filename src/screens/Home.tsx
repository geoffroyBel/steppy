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
      console.log(a, "a");
      if (!a) {
        console.log("requesting permission", a);
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

        {/* <ObjectifCard
          objectifs={[
            { id: 1, progress: 0.6 },
            { id: 1, progress: 0.8 },
          ]}
        /> */}

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
