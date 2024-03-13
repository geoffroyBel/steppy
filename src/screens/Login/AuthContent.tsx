import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import FlatButton from "./ui/FlatButton";
import AuthForm from "./AuthForm";
import { Colors } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProps } from "../../navigators/Navigation";
import { Credentials } from "../../types";
interface IProps {
  isLogin: boolean;
  onAuthenticate: (credentials: Credentials) => void;
}
function AuthContent({ isLogin, onAuthenticate }: IProps) {
  const navigation = useNavigation<AuthNavigationProps<"Onboarding">>();
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    code: false,
    password: false,
  });

  function switchAuthModeHandler() {
    navigation.replace("Onboarding");
  }

  function submitHandler(credentials: Credentials) {
    let { password, code } = credentials;

    code = code.trim();
    password = password.trim();

    const codeIsValid = code.length > 3;
    const passwordIsValid = password.length > 6;

    if (!codeIsValid || !passwordIsValid) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        code: !codeIsValid,
        password: !passwordIsValid,
      });
      return;
    }
    onAuthenticate({ code, password });
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    // backgroundColor: Colors.primary800,
    // elevation: 2,
    // shadowColor: "black",
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.35,
    // shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
