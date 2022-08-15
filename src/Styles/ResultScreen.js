import { StyleSheet } from "react-native";

export const ResultStyles = StyleSheet.create({
    wd: {
        marginTop: 30,
        marginHorizontal: 25,
        marginBottom: 20
    },
    wd_title: {
        marginBottom: 15,
        flexDirection: "row"
    },
    wd_title_text: {
        color: '#213646',
        fontSize: 24,
        fontFamily: 'RobotoSlab-Medium',
    },
    wd_transcription: {
        marginBottom: 15
    },
    wd_transcription_text: {
        fontStyle: "italic",
        color: '#213646',
        fontSize: 20,
    },
    wd_translation_text: {
        color: '#213646',
        fontStyle: "italic",
        fontSize: 17
    },
    rank: {
        color: '#213646',
        lineHeight: 16,
        marginLeft: 3,
        fontSize: 11
    },
    img: {
        width: 16,
        height: 21,
        alignItems: 'center'
    }
})