import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "./ui/Button";
import Input from "./Input";

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredCode, setEnteredCode] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const {
    code: codeIsInvalid,

    password: passwordIsInvalid,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "password":
        setEnteredPassword(enteredValue);
        break;

      case "code":
        setEnteredCode(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      code: enteredCode,
      password: enteredPassword,
    });
  }

  return (
    <View>
      <View>
        <Input
          label="Code"
          onUpdateValue={updateInputValueHandler.bind(this, "code")}
          value={enteredCode}
          isInvalid={codeIsInvalid}
        />
        <Input
          label="Password"
          onUpdateValue={updateInputValueHandler.bind(this, "password")}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
