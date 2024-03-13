import { View, StyleSheet, Text } from "react-native";
import IconButton from "./IconButton";
import { useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";

export default () => {
const {logout} = useContext(AuthContext)
  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 0,
        position: "relative",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <IconButton icon="arrow-back" color={"white"} size={45} />
      </View>
      <Text style={styles.title}>{"Choisir un avatar"}</Text>
      <View>
        <IconButton icon="log-out" color={"white"} size={45} onPress={logout} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontFamily: "Montserrat",
    fontWeight: "400",
    fontSize: 24,
    color: "white",
  },
});
