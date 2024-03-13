import { View, StyleSheet, Image, Pressable, Dimensions, Text } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IBadge {
    progress: number;
    image: string;
    title: string;
    description: string;
    isStreak: boolean;
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    root: {
        height: height * 0.14,
        width: height * 0.14,
    },
})

export const Badge = ({
    progress,
    image,
    title,
    description,
    isStreak,
}: IBadge) => {
    const [stepPersonal, setStepPersonal] = useState(10000);
    const [stepGlobal, setStepGlobal] = useState(100000);

    let displayProgress = progress;

    if (isStreak == true) {
        const percentage = Math.min((stepPersonal / progress), 1);
        console.log("percentage : ", percentage)
        displayProgress = percentage.toFixed(2);
    }

    return (
        <View>
            <Text>{image}</Text>
            <Text>{displayProgress}</Text>
            <Text>{title}</Text>
            <Text>{description}</Text>
        </View>
    )
}
