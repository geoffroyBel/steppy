import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import Animated from "react-native-reanimated";
import Podometer from "./src/podometer/Podometer";
import { NavigationContainer } from "@react-navigation/native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChallengeTabBar from "./src/navigators/ChallengeTabBar";
import OnboardingStack from "./src/navigators/OnboardingStack";
import AuthProvider, {
  AuthContext,
  IAuthContext,
} from "./src/Providers/AuthProvider";
import Navigation from "./src/navigators/Navigation";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { TOKEN } from "./src/store/actions/auth";
import { getLastDailySteps } from "./src/store/actions/dailySteps";
import Providers from "./src/Providers";
import { StepContext } from "./src/Providers/StepProvider";
import { IStepContext } from "./src/types";
import { isTimeToUpdate } from "./src/utils/dateUtils";
import { LAST_DAILY_STEP_TIMESTAMP } from "./src/config";
import { useFonts } from "expo-font";


function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const { authenticate, logout, user } = useContext(
    AuthContext
  ) as IAuthContext;
  const { handleFetchDaily, handleUpdateDaily, handleFetchStats } = useContext(
    StepContext
  ) as IStepContext;

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem(TOKEN);
      if (storedToken) {
        authenticate(storedToken);
        // await SplashScreen.hideAsync();
      }
      setIsTryingLogin(false);
    };
    if (!user) {
      fetchToken();
    }
  }, [user]);

  useEffect(() => {
    const fetchDailySteps = async () => {
      if (!handleFetchDaily) return;

      const steps = await handleFetchDaily({
        from: "2024-02-15",
        to: "2024-03-13",
      });
    };
    fetchDailySteps();
  }, [handleFetchDaily]);
  useEffect(() => {
    const fetchStats = async () => {
      await handleFetchStats();
    };

    fetchStats();
  }, []);
  useEffect(() => {
    const saveDailySteps = async () => {
      if (!handleUpdateDaily || !handleFetchDaily) return;
      const lastDailyUpdateTime = await AsyncStorage.getItem(
        LAST_DAILY_STEP_TIMESTAMP
      );
      const isTimeElapsed = lastDailyUpdateTime
        ? isTimeToUpdate(lastDailyUpdateTime)
        : true;

      if (isTimeElapsed) {
        await handleUpdateDaily();
      }
      await handleFetchDaily({
        from: new Date().toISOString(),
        to: new Date().toISOString(),
      });
    };
    saveDailySteps();
  }, [handleUpdateDaily, handleFetchDaily]);
  return <Navigation />;
}
export default function App() {
  const [fontsLoaded] = useFonts({
    MontserratRegular: require("./assets/font/Montserrat-Regular.otf"),
    MontserratSemiBold: require("./assets/font/Montserrat-SemiBold.otf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <Providers>
          <Root />
        </Providers>
      </SafeAreaProvider>
    </GestureHandlerRootView>

    // <SafeAreaView style={styles.container}>

    //   <StatusBar style="auto" />
    //   <Canvas style={{ flex: 1 }}>
    //     <Path path={path} color="lightblue" />
    //   </Canvas>
    //   <Animated.View
    //     style={{
    //       width: 100,
    //       height: 100,
    //       backgroundColor: "violet",
    //     }}
    //   />
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",

    justifyContent: "center",
  },
  circularContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    color: "#FF9900",
  },
});
