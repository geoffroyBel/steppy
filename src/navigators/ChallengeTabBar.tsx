import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Challenge, Home } from "../screens";
import { NavigationContainer } from '@react-navigation/native';
import Profile from "../screens/Profile";
import CustomTabBar from "../components/ui/CustomTabBar";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from "react-native";

const Tab = createBottomTabNavigator();

export default () => {
  const insets = useSafeAreaInsets();
  return (
      <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen name="Challenge" component={Challenge} options={{ tabBarIcon: 'earth' }}/>
        <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: 'home' }}/>
        <Tab.Screen name="Profile" component={Profile} options={{ image: require("../../assets/avatar.png") }}/>
      </Tab.Navigator>
  );
};
