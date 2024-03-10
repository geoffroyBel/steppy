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
import { createuser, signin } from "../../api/auth";
import LoadingOverlay from "./ui/LoadingOverlay";
import { AuthContext, IAuthContext } from "../../Providers/AuthProvider";

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

  const signinHandler = async () => {
    setIsAuthenticated(true);
    try {
      const token = await signin("g@g.com", "password");
      authenticate(token);
    } catch (error) {
      Alert.alert(
        "Chargement échoué",
        "Impossible de Charger votre profile, reessayer plus tard"
      );
      setIsAuthenticated(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={StyleSheet.absoluteFill}>
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
        {isAuthenticating ? (
          <LoadingOverlay message={"Chargement du profile"} />
        ) : (
          <AuthContent isLogin={true} onAuthenticate={signinHandler} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "Montserrat",
    fontWeight: "900",
    fontSize: 35,
    lineHeight: 42,
    color: "background: rgba(0, 95, 171, 1)",
    textAlign: "center",
  },
  content: {
    fontFamily: "Montserrat",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 17,
    color: "background: rgba(0, 95, 171, 1)",
    textAlign: "center",
  },
});
