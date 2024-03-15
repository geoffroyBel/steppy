import { View, Text, TextInput, StyleSheet } from "react-native";
import { useFonts } from 'expo-font';
import { Colors } from "../../constants/styles";
import { rgb } from "d3";

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}) {
  useFonts({
    "Montserrat": require("../../../assets/font/Montserrat-Regular.otf"),
    "Montserrat-SemiBold": require("../../../assets/font/Montserrat-SemiBold.otf"),
    "Montserrat-Thin": require("../../../assets/font/Montserrat-Thin.otf"),
  })
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid, value === ""? styles.labelPlaceholder : styles.null]}
        autoCapitalize={false}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
        placeholder={label}
      />
    </View>
  );
}

export default Input;

const blue = "#005FAB"
const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: blue,
    marginBottom: 4,
  },
  labelInvalid: {
    color: Colors.error500,
  },
  input: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: blue,
    fontFamily: "Montserrat",
    color: blue,
  },  
  labelPlaceholder: {
    fontStyle: "italic",
    color: blue,
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});
