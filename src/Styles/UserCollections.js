import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: "center",
        marginTop: 30,
        marginBottom: 60
    },
    rectangle: {
        height: 42,
        width: '92%',
        backgroundColor: '#ffdca9',
        borderRadius: 6,
        flexDirection: "row"
    },
    title: {
        color: "#583627",
        fontWeight: "700",
        height: "100%",     
        textAlignVertical: "center",
        
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "2%",
        width: "46%",
        height: "100%"
    }
})