import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState, useEffect,  useRef, useContext } from "react";
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import Svg, { Defs, Rect, LinearGradient, Stop, Path } from "react-native-svg";
import NavBar from "./ui/NavBar";
import { Avatar } from "../../components/ui/Avatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IconButton from "./ui/IconButton";
import { getProfilBadge } from "../../store/actions/profilData";
import { Badge } from "../../components/ui/Badge";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { AuthContext } from "../../Providers/AuthProvider";
import { getAllAvatar } from "../../store/actions/avatarData";
import { avatarImages, getAvatar, getBadges } from "../../../images";


const { height, width, scale } = Dimensions.get("screen");
console.log("scale : ",scale);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const HEADER_HEIGHT = 0.4 * height;
const p1 = { x: 0 - 50, y: 0.3 * HEADER_HEIGHT };
const p2 = { x: width + 50, y: 0.3 * HEADER_HEIGHT };
const c1 = { x: 0.1 * width, y: 0.3 * HEADER_HEIGHT };
const c2 = { x: 0.9 * width, y: 0.3 * HEADER_HEIGHT };
const FROM_COLOR = "rgb(23, 99, 174)";
const TO_COLOR = "rgb(34,121,190)";
export default () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <View>
        <Text>Veuillez vous connecter pour accéder à votre profil.</Text>
      </View>
    );
  }

  const radius = useSharedValue(HEADER_HEIGHT);
  const scale = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const [showAvatarDetails, setShowAvatarDetails] = useState(false);
  const [profilAvatarData, setProfilAvatarData] = useState(null);
  const [avatars, setAvatars] = useState(null);
  useEffect(() => {
    const fetchDataProfilBadge = async () => {
      try {
        const data = await getProfilBadge();
        setProfilAvatarData(data);
      } catch (error) {
        console.error("Failed to fetch profile badge data:", error);
      }
    };

    fetchDataProfilBadge();

    const fetchDataAllAvatars = async () => {
      try {
        const data = await getAllAvatar();
        setAvatars(data);
      } catch (error) {
        console.error("Failed to fetch profile badge data:", error);
      }
    };

    fetchDataAllAvatars();
  }, []);

  // Console log the profile avatar data
  useEffect(() => {
    console.log("Profile Avatar Data:", profilAvatarData);
  }, [profilAvatarData]);
  
  

  const [stepPersonal, setstapPersonal] = useState(10000);
  const [stepGlobal, setstapGlobal] = useState(100000);

  const [badge, setbadge] = useState([
    {
        "id": 1,
        "image": "placeholder.png",
        "name": "Dr. Cathryn Schaefer",
        "description": "Commodi autem modi iusto et.",
        "isStreak": false,
        "quantity": 23034,
        "isGlobal": false,
        "created_at": "2024-03-13T09:31:05.000000Z",
        "updated_at": "2024-03-13T09:31:05.000000Z"
    },
    {
        "id": 2,
        "image": "placeholder.png",
        "name": "Tess Effertz PhD",
        "description": "Labore dolor molestias est harum nisi rem quo.",
        "isStreak": false,
        "quantity": 12615,
        "isGlobal": false,
        "created_at": "2024-03-13T09:31:05.000000Z",
        "updated_at": "2024-03-13T09:31:05.000000Z"
    },
    {
        "id": 3,
        "image": "placeholder.png",
        "name": "Katlynn Bogan",
        "description": "Facere nihil beatae ut tenetur similique mollitia.",
        "isStreak": false,
        "quantity": 19897,
        "isGlobal": false,
        "created_at": "2024-03-13T09:31:05.000000Z",
        "updated_at": "2024-03-13T09:31:05.000000Z"
    },
    {
        "id": 4,
        "image": "placeholder.png",
        "name": "Ashlynn Goyette",
        "description": "Deleniti ipsum voluptas odit dicta harum dolores.",
        "isStreak": true,
        "quantity": 25,
        "isGlobal": false,
        "created_at": "2024-03-13T09:31:05.000000Z",
        "updated_at": "2024-03-13T09:31:05.000000Z"
    },
    {
      "id": 5,
      "image": "placeholder.png",
      "name": "Ashlynn Goyette",
      "description": "Deleniti ipsum voluptas odit dicta harum dolores.",
      "isStreak": true,
      "quantity": 25,
      "isGlobal": false,
      "created_at": "2024-03-13T09:31:05.000000Z",
      "updated_at": "2024-03-13T09:31:05.000000Z"
    },
    {
      "id": 4,
      "image": "placeholder.png",
      "name": "Ashlynn Goyette",
      "description": "Deleniti ipsum voluptas odit dicta harum dolores.",
      "isStreak": true,
      "quantity": 25,
      "isGlobal": false,
      "created_at": "2024-03-13T09:31:05.000000Z",
      "updated_at": "2024-03-13T09:31:05.000000Z"
  },
  {
    "id": 5,
    "image": "placeholder.png",
    "name": "Ashlynn Goyette",
    "description": "Deleniti ipsum voluptas odit dicta harum dolores.",
    "isStreak": true,
    "quantity": 25,
    "isGlobal": false,
    "created_at": "2024-03-13T09:31:05.000000Z",
    "updated_at": "2024-03-13T09:31:05.000000Z"
  },
  {
    "id": 4,
    "image": "placeholder.png",
    "name": "Ashlynn Goyette",
    "description": "Deleniti ipsum voluptas odit dicta harum dolores.",
    "isStreak": true,
    "quantity": 25,
    "isGlobal": false,
    "created_at": "2024-03-13T09:31:05.000000Z",
    "updated_at": "2024-03-13T09:31:05.000000Z"
},
{
  "id": 5,
  "image": "placeholder.png",
  "name": "Ashlynn Goyette",
  "description": "Deleniti ipsum voluptas odit dicta harum dolores.",
  "isStreak": true,
  "quantity": 25,
  "isGlobal": false,
  "created_at": "2024-03-13T09:31:05.000000Z",
  "updated_at": "2024-03-13T09:31:05.000000Z"
},
    {
        "id": 5,
        "image": "placeholder.png",
        "name": "Halle Anderson PhD",
        "description": "Facilis libero voluptas maxime labore.",
        "isStreak": false,
        "quantity": 23056,
        "isGlobal": false,
        "created_at": "2024-03-13T09:31:05.000000Z",
        "updated_at": "2024-03-13T09:31:05.000000Z"
    }
]);
  
  const handleAvatarNav = (boolean: boolean) => {
    setShowAvatarDetails(boolean);
  };

  useFocusEffect(
    useCallback(() => {
      scale.value = 0;
      radius.value = p1.y;
      radius.value = withTiming(HEADER_HEIGHT, { duration: 1000 }, () => {
        scale.value = withTiming(1);
      });
    }, [])
  );
  const animatedProps = useAnimatedProps(() => {
    const gap = 0;
    const path = `
      M ${p1.x}, ${p1.y + gap}
      C ${c1.x}, ${radius.value} ${c2.x}, ${radius.value} ${p2.x}, ${
      p2.y + gap
    } L ${width} ${0} L 0,0 Z
      `;
    return {
      d: path,
    };
  });
  const styleScale = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, []);

  const renderAvatars = () => {
    if (avatars) {
      return avatars.map((avatar, index: number) => {
        // const images = require.context('../../../assets/avatar', true, /\.png$/);
        // const imageSources = images.keys().map((index) => images(index));
        const imageSources = avatarImages[`avatar${index}`];
        return (
          <Avatar
            key={index}
            progress={1}
            isSelected={avatar.isSelected}
            image={getAvatar((index+1).toString())}
            // onPress={() => handleAvatarPress(index, avatar.progress)}
          />
        );
      });
    } else {
      return null;
    }
  };
  
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Svg style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor={FROM_COLOR} />
              <Stop offset="1" stopColor={TO_COLOR} />
            </LinearGradient>
          </Defs>
          <AnimatedPath animatedProps={animatedProps} fill="url(#grad)" />
        </Svg>
        <View style={{ marginTop: insets.top }} />
        <NavBar  titre={"Votre titre"} setShowAvatarDetails={setShowAvatarDetails} showAvatarDetails={showAvatarDetails} />
        <TouchableOpacity onPress={() => handleAvatarNav(true)}>
          <Animated.View style={[styles.avatar, styleScale]} >
            {/* {avatars.map((avatar, index) => {
              if (avatar.userSelect) {
                return <Image key={index} style={styles.image} source={avatar.image} />;
              }
            })} */}
          </Animated.View>
      </TouchableOpacity>
        
      </View>
      {showAvatarDetails ? (
        <View style={styles.main}>
          <Animated.View style={[styleScale]}>
          <View style={styles.main}>
            {renderAvatars()}
          </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.changeAvatarButton}
                // onPress={handleChangeAvatar}
              >
                <Text style={styles.changeAvatarButtonText}>Changer d'avatar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.main}>
            {badge.map((badgeItem) => (
              badgeItem.isStreak ? (
                <Badge
                  key={badgeItem.id}
                  progress={badgeItem.quantity}
                  image={getBadges(badgeItem.id.toString())}
                  title={badgeItem.name}
                  description={badgeItem.description}
                  isStreak={badgeItem.isStreak}
                />
              ) : null
            ))}
          </View>
        </ScrollView>


      )}


      </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
  },
  main: {
    flex: 1,
    marginTop: scale * -30,
  },
  headerTitle: {
    fontFamily: "Montserrat",
    fontWeight: "400",
    fontSize: 24,
    color: "black",
  },
  avatar: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: 100,
    backgroundColor: "white",
    borderRadius: 100,
    height: height * 0.14,
    width: height * 0.14,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', 
    paddingVertical: 20,

  },
  changeAvatarButton: {
    backgroundColor: '#005FAB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  changeAvatarButtonBack: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  changeAvatarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image:{
    height: height * 0.13,
    width: height * 0.13,
    // backgroundColor: "white",
    // borderRadius: 100,
  },
  scrollContainer: {
    flexGrow: 1,
    // marginTop: -0,
    paddingTop: 100,
  },
});
