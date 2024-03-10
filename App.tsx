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
import { TOKEN } from "./src/api/auth";

SplashScreen.preventAutoHideAsync();

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const { authenticate } = useContext(AuthContext) as IAuthContext;
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem(TOKEN);
      if (storedToken) {
        authenticate(storedToken);
        await SplashScreen.hideAsync();
      }
      setIsTryingLogin(false);
    };
    fetchToken();
  }, []);
  return <Navigation />;
}
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AuthProvider>
          <Root />
          {/* <NavigationContainer>
            <OnboardingStack />
             <ChallengeTabBar /> 
          </NavigationContainer> */}
        </AuthProvider>
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
