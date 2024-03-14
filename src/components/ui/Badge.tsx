import React from 'react';
import { useEffect, useMemo, useState } from "react";
import HorizontalLoader from "./HorizontalLoader";
import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
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
    loader:{
        width: width * 0.7,
        height: height * 0.7,
    },
    imageSucces:{
        width: 40, 
        height: 40, 
        marginRight: 10, 
    }
});


export const Badge = ({
    progress,
    image,
    title,
    description,
    isStreak,
}: IBadge) => {
    const [stepPersonal, setStepPersonal] = useState(10);
    const [stepGlobal, setStepGlobal] = useState(100000);
    const [transition, setTransition] = useState(1);
    let displayProgress = progress;

    if (isStreak == true) {
        const percentage = Math.min((stepPersonal / progress), 1);
        console.log("percentage : ", percentage)
        displayProgress = percentage.toFixed(2);
    }

    
    return (
        <View style={styles.root}>
                <Image
                          source={require("../../../assets/badgePerso/badgePerso1.png")}
                          style={styles.image}
                /> 
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <HorizontalLoader
                            width={width * 0.50}
                            height={10}
                            progress={displayProgress}
                        />
                        <Image
                            source={require("../../../assets/success.png")}
                            style={styles.imageSucces}
                        /> 
                    </View>
                </View>
            </View>
        // <View style={styles.container}/>
    )
}
