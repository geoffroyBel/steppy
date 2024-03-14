import React from 'react';
import { useEffect, useMemo, useState } from "react";
import HorizontalLoader from "./HorizontalLoader";
import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Import user context
interface IBadge {
    quantity: number;
    image: string;
    title: string;
    description: string;
    isStreak: boolean;
    totalSteps: number;
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    root: {
        width: width - 20,
        padding: 10,
        flexDirection: 'row',
        marginBottom: 10, // Ajout de marge en bas pour séparer les badges
    },
    container: {
        borderBottomWidth: 1, // Épaisseur de la bordure en bas
        borderColor: 'gray', // Couleur de la bordure
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
    },
    loader: {
        width: width * 0.7,
        height: height * 0.7,
    },
    imageSucces: {
        width: 40,
        height: 40,
        marginRight: 10,
    }
});


export const Badge = ({
    quantity,
    image,
    title,
    description,
    isStreak,
    totalSteps
}: IBadge) => {
    const [stepPersonal, setStepPersonal] = useState(totalSteps);
    const [stepGlobal, setStepGlobal] = useState(100000);
    const [transition, setTransition] = useState(1);
    let displayQuantity = quantity;
    let percentage = Math.min((stepPersonal / quantity), 1);
    const percentageOutOf100 = (percentage * 100).toFixed(2);
    displayQuantity = percentageOutOf100;

    const isBadgeUnlocked = quantity <= stepPersonal;


    return (
        <View style={styles.root}>
            <Image
                source={image}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <HorizontalLoader
                        width={width * 0.50}
                        height={10}
                        progress={percentageOutOf100} // Utilise le pourcentage sur 100%
                        string={`${stepPersonal}/${quantity}`}
                    />
                    {isBadgeUnlocked ?
                        <Image
                            source={require("../../../assets/success.png")}
                            style={styles.imageSucces}
                        />
                        : null
                    }
                </View>
                {!isBadgeUnlocked ? <Text>{stepPersonal}/{quantity}</Text> : null}
            </View>
        </View>
    )
}