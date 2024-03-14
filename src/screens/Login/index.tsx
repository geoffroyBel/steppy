import {
  Canvas,
  LinearGradient,
  Path,
  Rect,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  ImageURISource,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Slides from "../../components/ui/Slides";
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  interpolate,
} from "react-native-reanimated";
import Button from "../../components/ui/Button";
import AuthContent from "./AuthContent";
import { AuthNavigationProps } from "../../navigators/Navigation";
import { createuser, signin } from "../../store/actions/auth";
import LoadingOverlay from "./ui/LoadingOverlay";
import { AuthContext, IAuthContext } from "../../Providers/AuthProvider";
import { Credentials } from "../../types";
import { useFonts } from "expo-font"; // Add this import statement

const mockCredentials = {
  code: "123456789",
  password: "password",
};
const { width } = Dimensions.get("screen");
const height = 210;

interface SlideProps {
  title: string;
  content: string;
  source?: ImageURISource;
}

interface DotsProps {
  x: SharedValue<number>;
  total: number;
}

interface ImagesProps {
  slides: SlideProps[];
  x: SharedValue<number>;
}

export default ({ navigation }: AuthNavigationProps<"Login">) => {
  const { authenticate } = useContext(AuthContext) as IAuthContext;
  const [isAuthenticating, setIsAuthenticated] = useState<Boolean>(false);
  const x = useSharedValue(0);
  const side = useSharedValue(0);
  const path1 = useMemo(() => {
    const c1 = vec((1 / 4) * width, (3 / 4) * height);
    const c2 = vec((3 / 4) * width, (1 / 4) * height);
    const p1 = vec(0, (1 / 4) * height);
    const p2 = vec(width, height);
    const str = `M 0 0 L ${p1.x} ${p1.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y} L ${width} 0 Z`;
    return Skia.Path.MakeFromSVGString(str)!;
  }, []);

  const signinHandler = async ({ code, password }: Credentials) => {
    setIsAuthenticated(true);

    try {
      const token = await signin({ code, password });
      authenticate(token);
    } catch (error) {
      Alert.alert(
        "Chargement échoué",
        "Impossible de Charger votre profile, reessayer plus tard"
      );
      setIsAuthenticated(false);
    }
  };

  const [fontsLoaded] = useFonts({
    MontserratRegular: require("../../../assets/font/Montserrat-Regular.otf"),
    MontserratSemiBold: require("../../../assets/font/Montserrat-SemiBold.otf"),
  });

  if (!fontsLoaded) {
    return <LoadingOverlay message={"Chargement des polices..."} />;
  } else {
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View>
              <View style={{ height: height, width: "100%" }}>
                <Canvas style={StyleSheet.absoluteFillObject}>
                  <Path path={path1} style={"fill"}>
                    <LinearGradient
                      transform={[{ rotate: Math.PI / 2 }]}
                      start={vec(0, 0)}
                      end={vec(290, 0)}
                      colors={["rgba(0, 95, 171, 1)", "rgba(27, 184, 235, 1)"]}
                    />
                  </Path>
                </Canvas>
              </View>
              <View style={styles.authLogoContainer}>
                <Text style={styles.title}>Bienvenue !</Text>
                <Text style={styles.content}>
                  Connectes-toi pour pouvoir accèder à Steppy
                </Text>
                <Image style={styles.authLogo} source={require("../../../assets/turtle.png")} />
              </View>
              {isAuthenticating ? (
                <LoadingOverlay message={"Chargement du profil"} />
              ) : (
                <AuthContent isLogin={true} onAuthenticate={signinHandler} />
              )}
              <View style={styles.logos}>
                <Image source={require("../../../assets/cesi.png")} />
                <Image source={require("../../../assets/chu.png")} />
              </View>
            </View>
            {/* hide if keyboard is open: */}

            <View style={styles.bottomBlue}></View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "MontserratSemiBold",
    fontSize: 35,
    lineHeight: 42,
    color: "background: rgba(0, 95, 171, 1)",
    textAlign: "center",
  },
  content: {
    fontFamily: "MontserratRegular",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 17,
    color: "background: rgba(0, 95, 171, 1)",
    textAlign: "center",
  },
  authLogoContainer: {
    marginTop: -32,
    alignItems: "center",
  },
  authLogo: {
    width: 150,
    height: 150,
  },
  logos: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 100,
  },
  bottomBlue: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    backgroundColor: "rgba(0, 95, 171, 1)",
  },
});
