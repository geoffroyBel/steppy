import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Onbording from "../screens/Onbording";
import Login from "../screens/Login";
import { AuthRoutes } from "./Navigation";

const Stack = createNativeStackNavigator<AuthRoutes>();

export default () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={Onbording} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};
