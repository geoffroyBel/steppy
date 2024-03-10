import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
export interface IButton {
  label: string;
  icon?: string;
  padding?: number;
  onPress: () => void;
  fontSize?: number;
  maxWidth?: number;
  maxHeight?: number;
  active?: boolean;
}
const Button = ({
  onPress,
  label,
  icon,
  padding,
  fontSize,
  maxWidth = 100,
  maxHeight = 42,
  active,
}: IButton) => {
  const toggle = useSharedValue(0);

  useEffect(() => {
    toggle.value = active ? 1 : 0;
  }, [active]);

  const handleOnpress = (e: boolean) => {
    onPress();
  };
  const transition = useDerivedValue(() => {
    return withTiming(toggle.value, {
      duration: 300,
    });
  }, [toggle]);
  const backgroundColor = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        transition.value,
        [0, 1],
        ["rgba(0, 95, 171, 0.2)", "rgba(0, 95, 171, 1)"]
      ),
    };
  });
  return (
    <RectButton onPress={handleOnpress} style={{ borderRadius: 15 }}>
      <Animated.View style={[styles.root, backgroundColor]}>
        {icon && (
          <View style={{ width: 32, height: 32, marginLeft: "auto" }}>
            <Image
              source={require("../../../assets/icons/accueil_main.png")}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
            />
          </View>
        )}

        <Text style={[styles.label, { fontSize, padding }]}>{label}</Text>
      </Animated.View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "rgba(0, 95, 171, 1)",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    minWidth: 80,
  },
  label: {
    color: "white",
    fontFamily: "Montserrat",
    fontWeight: "400",
    lineHeight: 17,
    textAlign: "center",

    marginLeft: "auto",
    marginRight: "auto",
  },
  active: {
    backgroundColor: "rgba(0, 95, 171, 0.3)",
  },
});

export default Button;
