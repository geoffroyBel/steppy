import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import IconButton from "./IconButton";
import { useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";

export default () => {
const {logout} = useContext(AuthContext)
  return (
    <View style={styles.container}>

      <View style={styles.iconContainer}>
        
      {showAvatarDetails == false ? (
          <IconButton onPress={() => setShowAvatarDetails(true)} icon="camera" color={"white"} size={45} />
        ) : (
          <IconButton onPress={() => setShowAvatarDetails(false)} icon="arrow-back" color={"white"} size={45} />
        )}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{titre}</Text>
      </View>
      <Text style={styles.title}>{"Choisir un avatar"}</Text>
      <View>
        <IconButton icon="log-out" color={"white"} size={45} onPress={logout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    // backgroundColor: "red",
    fontFamily: "Montserrat",
    fontWeight: "400",
    fontSize: 24,
    color: "white",
    textAlign: "center",
  },
  iconContainer: {
    marginLeft: "auto",
  },
});
