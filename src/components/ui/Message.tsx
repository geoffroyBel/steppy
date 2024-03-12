import { useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
interface Iprops {
  content: string;
  isSelected: boolean;
}
export default ({ content, isSelected }: Iprops) => {
  const translateX = useSharedValue(100);
  const scaleY = useSharedValue(0);
  useEffect(() => {
    // console.log("j ai un content ?");

    // console.log(content);
  }, [content]);
  useEffect(() => {
    let x = isSelected ? 0 : 100;
    const scale = isSelected ? 1 : 0;
    if (isSelected) {
      //la tortue arrive
      translateX.value = withTiming(0, { duration: 1000 }, () => {
        scaleY.value = withTiming(1, { duration: 500 });
      });
    } else {
      //la tortue sen va puis se replace pour prochain affichage
      scaleY.value = 0;
      translateX.value = 100;
    }
  }, [content, isSelected]);
  const turleStyle = useAnimatedStyle(() => {
    const scale = interpolate(translateX.value, [100, 0], [0, 1]);
    return {
      transform: [{ translateX: translateX.value }, { scale: scale }],
    };
  });
  const bubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: scaleY.value }, { scaleX: scaleY.value }],
    };
  });

  return (
    <View style={styles.root}>
      <View style={{ flex: 0.8 }}>
        <Animated.View style={[styles.textContainer, bubbleStyle]}>
          <Text style={styles.label}>{content}</Text>
        </Animated.View>
      </View>
      <View style={{ flex: 0.3 }}>
        <Animated.Image
          source={require("../../../assets/turtle.png")}
          style={[
            {
              marginRight: "auto",
              width: 67,
              height: 67,
            },
            turleStyle,
          ]}
        />
      </View>
      {/*
       */}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "row",

    marginBottom: 30,
  },
  textContainer: {
    marginLeft: "auto",

    width: 220,
    marginVertical: "auto",
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
    borderTopRightRadius: 9,
    backgroundColor: "rgba(232, 232, 232, 1)",
    padding: 10,
  },
  label: {
    fontFamily: "Monserrat",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 14,
    color: "rgba(4, 47, 82, 1)",
  },
});
