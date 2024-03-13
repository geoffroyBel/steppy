import { Image, Text, View } from "react-native";

import { ImageSourcePropType } from "react-native";

export default function HomeCard({ title, value, icon }: { title: string; value: string, icon: ImageSourcePropType }) {
    return (
        <View style={styles.container}>
            <Image style={styles.icon} source={icon} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = {
    container: {
        backgroundColor: "#005FAB",
        paddingHorizontal: 10,
        paddingVertical: 25,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "40%",
        marginVertical: 20,
    },
    title: {
        fontSize: 16,
        color: "white",
        fontFamily: "MontserratSemiBold",
        textAlign: "center",
    },
    value: {
        fontSize: 15,
        color: "white",
        fontFamily: "MontserratSemiBold",
        textAlign: "center",
    },
    icon: {
        width: 40,
        height: 40,
        marginBottom: 10,
        marginLeft: "auto",
        marginRight: "auto",
    },
};
