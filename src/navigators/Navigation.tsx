import { RouteProp, CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { NavigationContainer } from "@react-navigation/native";
import OnboardingStack from "./OnboardingStack";
import ChallengeTabBar from "./ChallengeTabBar";
import { AuthContext, IAuthContext } from "../Providers/AuthProvider";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

export interface AuthNavigationProps<RouteName extends keyof AuthRoutes> {
  navigation: NativeStackNavigationProp<AuthRoutes, RouteName>;
  route: RouteProp<AuthRoutes, RouteName>;
}

// export interface HomeNavigationProps<RouteName extends keyof HomeRoutes> {
//   navigation: DrawerNavigationProp<HomeRoutes, RouteName>;
//   route: RouteProp<HomeRoutes, RouteName>;
// }

export type AppRoutes = {
  Authentication: undefined;
  Home: undefined;
};

export type AuthRoutes = {
  Onboarding: undefined;
  Login: undefined;
};

export type HomeRoutes = {
  OutfitIdeas: undefined;
  FavoriteOutfits: undefined;
  TransactionHistory: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Cart: undefined;
};

// import Graphs from "./src/components/ui/Graphs";

export default function Navigation() {
  const { isAuthenticated, token } = useContext(AuthContext) as IAuthContext;
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
    } catch (error) {}
    axios
      .get(
        "https://strappie-default-rtdb.europe-west1.firebasedatabase.app/message.json?auth=" +
          token
      )
      .then((res) => {
        // console.log(res.data);
      })
      .catch((e) => {
        // console.log(e);
      });
  });
  return (
    <NavigationContainer>
      {/* <ChallengeTabBar /> */}
      {isAuthenticated ? <ChallengeTabBar /> : <OnboardingStack />}
    </NavigationContainer>
  );
}
