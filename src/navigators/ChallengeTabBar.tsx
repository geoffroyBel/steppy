import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Challenge, Home } from "../screens";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

export default () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Settings" component={Challenge} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
