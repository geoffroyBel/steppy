import { Canvas, RoundedRect, Shadow } from "@shopify/react-native-skia";
import { View, StyleSheet, Image, Text } from "react-native";
import HorizontalLoader from "./HorizontalLoader";
import { ReactNode, useEffect, useMemo } from "react";
import {
  SharedValue,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const w = 273;
const h = 88;
const _w = w + 15;
const _h = h + 10;
const x = (_w - w) / 2;
const y = (_h - h) / 2;

enum ObjectifName {
  OBJECTIF_CHU = "Objectif Chu",
  OBJECTIF_FRANCE = "Objectif France",
  OBJECTIF_EUROPE = "Objectif Europe",
  OBJECTIF_PLANETE = "Objectif Planète",
}
interface Objectif {
  progress: number;
  id: number;
  transition?: SharedValue<number>;
}
interface List {
  children?: ReactNode | ReactNode[];
  objectifs: Objectif[];
}

const OBJECTIFS = [
  {
    id: 1,
    title: "Objectif Chu",
    source: require("../../../assets/icons/objectif/1.png"),
    description: "Badge: Premier pas",
  },
  {
    id: 2,
    title: "Objectif France",
    source: require("../../../assets/icons/objectif/1.png"),
    description: "1000 Kilometre parcourue",
  },
  {
    id: 3,
    title: "Objectif Europe",
    source: require("../../../assets/icons/objectif/1.png"),
    description: "15 000 Kilometre parcourue",
  },
  {
    id: 4,
    title: "Ojectif Planète",
    source: require("../../../assets/icons/objectif/1.png"),
    description: "40 000 Kilometre parcourue",
  },
];

export const ObjectifCard = ({ progress = 0.5, id, transition }: Objectif) => {
  const objectif = useMemo(() => {
    return OBJECTIFS.find((el) => `${el.id}` === `${id}`);
  }, [id]);

  return (
    <View style={styles.root}>
      {/* <Canvas style={StyleSheet.absoluteFillObject}>
        <RoundedRect
          x={x}
          y={y}
          height={h}
          width={w}
          color={"rgba(0, 95, 171, 0.5)"}
          r={15}
        />
        <Shadow dx={5} dy={5} blur={5} color={"rgba(0, 0, 0, 0.5)"} />
      </Canvas> */}
      <View style={styles.container}>
        <View style={styles.containerImage}>
          <Image source={objectif?.source} />
        </View>
        <View style={styles.containerInfos}>
          <Text style={styles.title}>{objectif?.title}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <HorizontalLoader
              width={127}
              height={10}
              progress={progress}
              transition={transition}
            />
            <Text style={styles.textProgress}>{progress * 100}%</Text>
          </View>

          <Text style={styles.description}>{objectif?.description}</Text>
        </View>
      </View>
    </View>
  );
};

export default ({ objectifs }: List) => {
  const transition = useSharedValue(0);
  useEffect(() => {
    transition.value = withTiming(1, { duration: 3000 });
  }, []);
  return (
    <View style={{ alignItems: "center", paddingVertical: 10, columnGap: 30 }}>
      {objectifs.map((el, index) => (
        <ObjectifCard
          key={index}
          transition={transition}
          progress={el.progress}
          id={el.id}
        />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    width: w,
    height: h,
    elevation: 20,
    shadowColor: "#171717",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: "rgba(136, 185, 220, 1)",
    borderRadius: 15,
    marginVertical: 10,
  },
  container: {
    width: w,
    height: h,

    flexDirection: "row",
  },
  containerImage: {
    paddingTop: 15,
    paddingLeft: 15,
    height: "100%",

    flexDirection: "row",
  },
  containerInfos: {
    flex: 1,
    height: "100%",
    paddingVertical: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 13,
    textAlign: "center",
    color: "rgba(255, 255, 255, 1)",
  },
  description: {
    fontFamily: "Montserrat",
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 13,
    textAlign: "center",
    color: "rgba(255, 255, 255, 1)",
  },
  textProgress: {
    fontFamily: "Montserrat",
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 13,
    textAlign: "right",
    color: "rgba(255, 255, 255, 1)",
  },
});
