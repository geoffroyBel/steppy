import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Animated, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Canvas, Fill, LinearGradient, vec } from '@shopify/react-native-skia';
import { style } from 'd3';
import { Easing } from 'react-native-reanimated';

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 50,
        justifyContent: 'space-around'
    },
    image: {
        height: 48,
        width: 48,
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        width: 130,
        height: 55,
    },
    tabBarIn: {
        flexDirection: 'row',
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 50,
        justifyContent: 'space-around',
        backgroundColor: 'red',
        height: 50,

    },
    indicator: {
        position: 'absolute',
        width: 130,
        height: 55,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
    }
});

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    const { navigate } = useNavigation();
    const insets = useSafeAreaInsets();
    const [translateX] = useState(new Animated.Value(0));

    const moveIndicator = (index) => {
        Animated.timing(translateX, {
            toValue: index * 95,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    React.useEffect(() => {
        moveIndicator(state.index);
    }, [state.index]);

    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    return (
        <View style={[styles.tabBar, { paddingBottom: insets.bottom + 10 }, { zIndex: 20 }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                return (
                    <>
                        <View key={index} style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]}>
                            <Canvas style={{ flex: 1 }}>
                                <Fill>
                                    <LinearGradient
                                        start={vec(0, 0)}
                                        end={vec(390, 0)}
                                        colors={["rgba(57, 143, 199, 1)", "rgba(1, 96, 172, 1)"]}
                                    />
                                </Fill>
                            </Canvas>
                        </View>
                        <Animated.View style={[styles.tabBarIn, { zIndex: 20 }]}>
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 20 }}
                                key={route.name}
                            >
                                <View style={[styles.tabContent
                                    , isFocused && { backgroundColor: "#FFFFFF", borderRadius: 50 }
                                ]}>
                                    {options.tabBarIcon ? (
                                        <Ionicons
                                            name={options.tabBarIcon}
                                            size={48}
                                            color={isFocused ? '#007AFF' : '#FFFFFF'}
                                        />
                                    ) : (
                                        <Image
                                            source={options.image}
                                            style={styles.image}
                                        />
                                    )}

                                    {isFocused && (
                                        <Text style={{ color: '#007AFF', marginLeft: 5 }}>
                                            {label}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </Animated.View>

                    </>
                );
            })}
            {/* <Animated.View
                style={[
                    styles.indicator,
                    {
                        transform: [{ translateX }],
                        paddingTop: 10,
                    },
                ]}
            /> */}
        </View>
    );
};

export default CustomTabBar;
