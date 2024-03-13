import { View, StyleSheet, Image, Pressable, Dimensions } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IAvatar {
    progress: number;
    isSelected: boolean;
    image: string;
    onPress: () => void;
}

interface IAvatars {
    avatars: Array<{ progress: number; isSelected: boolean; image: string; }>;

}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    root: {
      height: height * 0.14,
      width: height * 0.14,
      margin: 9,
  
      justifyContent: "space-between",
    },
    header: {
      height: height * 0.14,
      width: height * 0.14,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 80,
      overflow: "hidden",
    },
    main: {
      height: height * 0.1,
      width: height * 0.1,
    },
    footer: {
      height: 15,
      width: 30,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    avatar: {
      height: height * 0.13,
      width: height * 0.13,
    }
});

export const Avatar = ({
  progress,
  isSelected,
  image,
  onPress,
}: IAvatar) => {
  
  const getBackgroundColor = () => {
      let backgroundColor;

      if (progress === 1 ){
        if (isSelected) {
          backgroundColor = "#005FAB";
        } else {
          backgroundColor = "lightblue";
        }
      } else {
        backgroundColor = "gray";
      }

      return backgroundColor;
  };
  const opacity = progress !== 1 ? 0.5 : 1;
  const backgroundColor = getBackgroundColor();

  return (
      <View style={styles.root}>
          <Pressable onPress={onPress}>
              <View style={[styles.header, { backgroundColor }] }>
                  <Image
                      source={image}
                      style={[styles.avatar, { opacity }]}
                  /> 
              </View>
          </Pressable>
      </View>
  );
}
