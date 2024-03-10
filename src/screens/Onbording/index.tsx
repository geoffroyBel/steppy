import {
  Canvas,
  Extrapolate,
  LinearGradient,
  Path,
  Rect,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  ImageURISource,
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

const { width } = Dimensions.get("screen");
const height = 210;
const SLIDES = [
  {
    title: "Bienvenue",
    content:
      "Hey toi ! Ravi de te voir ici. Steppy est conçue pour rendre chaque pas que tu fais significatif. Prêt à commencer ce voyage vers une vie plus active et équilibrée ?",
    source: require("./assets/t1.png"),
  },
  {
    title: "Récompenses",
    content:
      "Marche en obtenant des badges à chaque défi relevé. Chaque pas compte, et avec tes succès, une collection de badges t'attend pour souligner ta détermination.",
    source: require("./assets/t2.png"),
  },
  {
    title: "Personnalisation",
    content:
      "Chaque badge que tu remportes débloque un avatar unique. Personnalise ton profil avec des avatars, chacun représentant une victoire personnelle.",
    source: require("./assets/t3.png"),
  },
  {
    title: "Challenge",
    content:
      "Participe au Challenge et fais de chaque pas un pas collectif. Chaque pas que tu fais ajoute à notre total commun. Ensemble, nous créons un impact positif.",
    source: require("./assets/t3.png"),
  },
  {
    title: "Challenge",
    content:
      "Participe au Challenge et fais de chaque pas un pas collectif. Chaque pas que tu fais ajoute à notre total commun. Ensemble, nous créons un impact positif.",
    source: require("./assets/t3.png"),
  },
];
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
const Dot = () => {
  const w = 20;
  const center = vec((w - 12) / 2, (w - 12) / 2);
  return (
    <Canvas style={{ width: w, height: w }}>
      <Rect
        x={center.x}
        y={center.y}
        origin={vec(w / 2, w / 2)}
        width={12}
        height={12}
        transform={[{ rotate: Math.PI / 4 }]}
      >
        <LinearGradient
          start={vec(12, 0)}
          end={vec(0, 0)}
          colors={["rgba(0, 95, 171, 1)", "rgba(27, 184, 235, 1)"]}
        />
      </Rect>
    </Canvas>
  );
};

const Dots = ({ x, total }: DotsProps) => {
  const w = 20;
  const center = vec((w - 12) / 2, (w - 12) / 2);
  return (
    <View
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        width: 200,
        height: 20,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {new Array(total).fill(0).map((k, index) => {
        const color = useDerivedValue(() => {
          console.log(x.value);

          const d = interpolateColor(
            x.value,
            [(index - 1) * width, index * width],
            ["grey", "rgba(0, 95, 171, 1)"]
          );
          const d2 = interpolateColor(
            x.value,
            [(index - 1) * width, index * width],
            ["grey", "rgba(27, 184, 235, 1)"]
          );

          return [d, d2];
        });
        const style = useAnimatedStyle(() => {
          console.log(x.value);

          const d = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [1, 1.6, 1],
            Extrapolate.CLAMP
          );

          return { width: w, height: w, transform: [{ scale: d }] };
        });
        return (
          <Animated.View key={index} style={style}>
            <Canvas style={{ width: w, height: w }}>
              <Rect
                x={center.x}
                y={center.y}
                origin={vec(w / 2, w / 2)}
                width={12}
                height={12}
                transform={[{ rotate: Math.PI / 4 }]}
              >
                <LinearGradient
                  start={vec(12, 0)}
                  end={vec(0, 0)}
                  colors={["rgba(0, 95, 171, 1)", "rgba(27, 184, 235, 1)"]}
                />
              </Rect>
            </Canvas>
          </Animated.View>
        );
      })}
    </View>
  );
};
const Slide = ({ title, content }: SlideProps) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      <View style={{}}>
        <Button
          label={"Next"}
          padding={6}
          active={true}
          onPress={function (): void {
            console.log("gggg");
          }}
        />
      </View>
    </View>
  );
};
const SlideImages = ({ slides, x }: ImagesProps) => {
  return (
    <>
      {slides.map((source, index) => {
        const style = useAnimatedStyle(() => {
          const translateX = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [width / 2, 0, -width / 2]
          );
          const scale = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0, 1, 0]
          );
          return {
            transform: [{ translateX }, { scale }],
          };
        });
        return (
          <Animated.View
            key={index}
            style={[StyleSheet.absoluteFillObject, style]}
          >
            <Image
              source={source.source!}
              style={[
                {
                  marginTop: "auto",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: 125,
                  height: 125,
                  transform: [{ translateY: 20 }],
                },
              ]}
            />
          </Animated.View>
        );
      })}
    </>
  );
};
export default () => {
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

  const path2 = useMemo(() => {
    const c1 = vec((1 / 3) * width, (3 / 4) * height);
    const c2 = vec(0.5 * width + 20, (1 / 4) * height);
    const p1 = vec(0, 0);
    const p2 = vec(width, (3 / 4) * height);
    const str = `M 0 0 L ${p1.x} ${p1.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${
      p2.x
    } ${p2.y} L ${width} ${height} L ${0} ${height} Z`;
    return Skia.Path.MakeFromSVGString(str)!;
  }, []);
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
          <SlideImages x={x} slides={SLIDES} />
          {/* <Image
            source={require("./assets/t1.png")}
            style={[
              {
                marginTop: "auto",
                marginLeft: "auto",
                marginRight: "auto",
                width: 125,
                height: 125,
                transform: [{ translateY: 20 }],
              },
            ]}
          /> */}
        </View>

        <View style={{ flex: 1 }} />
        <Dots total={5} x={x} />
        <Canvas style={{ width: width, height: height }}>
          <Path path={path2} style={"fill"}>
            <LinearGradient
              origin={vec(width / 2, height / 2)}
              transform={[{ rotate: Math.PI - Math.PI / 2 }]}
              start={vec(290, 0)}
              end={vec(0, 0)}
              colors={["rgba(0, 95, 171, 1)", "rgba(27, 184, 235, 1)"]}
            />
          </Path>
        </Canvas>
      </View>
      <Slides style={{}} x={x} side={side} contentWidth={SLIDES.length * width}>
        {SLIDES.map((el, index) => (
          <Slide key={index} {...el} />
        ))}
      </Slides>
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
