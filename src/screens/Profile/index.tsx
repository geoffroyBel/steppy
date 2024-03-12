import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import Svg, { Defs, Rect, LinearGradient, Stop, Path } from "react-native-svg";
import NavBar from "./ui/NavBar";
import { Avatar } from "../../components/ui/Avatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("screen");
const AnimatedPath = Animated.createAnimatedComponent(Path);
const HEADER_HEIGHT = 0.4 * height;
const p1 = { x: 0 - 50, y: 0.3 * HEADER_HEIGHT };
const p2 = { x: width + 50, y: 0.3 * HEADER_HEIGHT };
const c1 = { x: 0.1 * width, y: 0.3 * HEADER_HEIGHT };
const c2 = { x: 0.9 * width, y: 0.3 * HEADER_HEIGHT };
const FROM_COLOR = "rgb(23, 99, 174)";
const TO_COLOR = "rgb(34,121,190)";
export default () => {
  const radius = useSharedValue(HEADER_HEIGHT);
  const scale = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const [avatars, setAvatars] = useState([
    { id: 1, progress: 1, isSelected: false, userSelect: false, image: require("../../../assets/avatar.png") },
    { id: 2,progress: 1, isSelected: true, userSelect: true, image: require("../../../assets/avatarBad.png") },
    { id: 3,progress: 0.8, isSelected: false, userSelect: false, image: require("../../../assets/avatar.png") },
    { id: 4,progress: 0.6, isSelected: false, userSelect: false, image: require("../../../assets/avatar.png") },
    { id: 5,progress: 0.4, isSelected: false, userSelect: false, image: require("../../../assets/avatarBad.png") },
    { id: 6,progress: 0.8, isSelected: false, userSelect: false, image: require("../../../assets/avatar.png") },
    { id: 7,progress: 0.6, isSelected: false, userSelect: false, image: require("../../../assets/avatar.png") },
    { id: 8,progress: 0.4, isSelected: false, userSelect: false, image: require("../../../assets/avatarBad.png") },
    { id: 9,progress: 0.4, isSelected: false, userSelect: false, image: require("../../../assets/avatarBad.png") },
  ]);

  const handleChangeAvatar = () => {
    const selectedIndex = avatars.findIndex((avatar) => avatar.isSelected);
    if (selectedIndex !== -1) {
      const selectedAvatarId = avatars[selectedIndex].id;
      console.log("ID de l'avatar sélectionné :", selectedAvatarId);
      
      setAvatars((prevAvatars) =>
        prevAvatars.map((avatar, index) => ({
          ...avatar,
          userSelect: index === selectedIndex ? true : false,
        }))
      );
    }
  };
  

  const handleAvatarPress = (index: number, progress: number) => {
    setAvatars((prevAvatars) => {
      const newAvatars = [...prevAvatars];
      if (progress == 1){
        newAvatars.forEach((avatar, i) => {
          if (i === index) {
            avatar.isSelected = true;
          } else {
            avatar.isSelected = false;
          }
        });
      }
      return newAvatars;
    });
  };
  

  useFocusEffect(
    useCallback(() => {
      radius.value = p1.y;
      radius.value = withTiming(HEADER_HEIGHT, { duration: 1000 }, () => {
        scale.value = withTiming(1);
      });
    }, [])
  );
  const animatedProps = useAnimatedProps(() => {
    console.log(insets.top);

    const gap = 0;
    const path = `
      M ${p1.x}, ${p1.y + gap}
      C ${c1.x}, ${radius.value} ${c2.x}, ${radius.value} ${p2.x}, ${
      p2.y + gap
    } L ${width} ${0} L 0,0 Z
      `;
    return {
      d: path,
    };
  });
  const styleScale = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, []);
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Svg style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor={FROM_COLOR} />
              <Stop offset="1" stopColor={TO_COLOR} />
            </LinearGradient>
          </Defs>
          <AnimatedPath animatedProps={animatedProps} fill="url(#grad)" />
        </Svg>
        <View style={{ marginTop: insets.top }} />
        <NavBar />

        <Animated.View style={[styles.avatar, styleScale]}>
          {avatars.map((avatar, index) => {
            if (avatar.userSelect) {
              return <Image key={index} source={avatar.image} />;
            }
          })}
        </Animated.View>
        
      </View>
      <View style={styles.main}>
        <View style={styles.avatarContainer}>
          {avatars.map((avatar, index) => (
              <Avatar
                key={index}
                progress={avatar.progress}
                isSelected={avatar.isSelected}
                image={avatar.image}
                onPress={() => handleAvatarPress(index, avatar.progress)}
              />
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.changeAvatarButton}
          onPress={handleChangeAvatar}
        >
          <Text style={styles.changeAvatarButtonText}>Changer d'avatar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
  },
  main: {
    flex: 1,
    marginTop: -40,
  },
  headerTitle: {
    fontFamily: "Montserrat",
    fontWeight: "400",
    fontSize: 24,
    color: "black",
  },
  avatar: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: 100,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  changeAvatarButton: {
    backgroundColor: '#005FAB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  changeAvatarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
