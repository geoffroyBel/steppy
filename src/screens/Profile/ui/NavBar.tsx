import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import IconButton from "./IconButton";
import { useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";

export default ({ titre, setShowAvatarDetails, showAvatarDetails }) => {
  const { logout } = useContext(AuthContext);
  // const [showAvatarDetails, setShowAvatarDetails] = useState(false);
  // const handleAvatarNav = (boolean: boolean) => {
  //   setShowAvatarDetails(boolean);
  // };
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
      <View style={styles.iconContainer}>
        <IconButton onPress={logout}  icon="log-out" color={"white"} size={45} />
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
