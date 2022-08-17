import { StyleSheet } from 'react-native';

export const ResultStyles = StyleSheet.create({
    wd: {
        marginTop: 30,
        marginHorizontal: 25,
        marginBottom: 20
    },
    wd_title: {
        marginBottom: 15,
        flexDirection: 'row'
    },
    wd_title_text: {
        color: '#213646',
        fontSize: 24,
        fontFamily: 'RobotoSlab-Medium',
    },
    wd_transcription: {
        flex: 1,
        flexDirection: 'row'
    },
    wd_transcription_text_i: {
        fontStyle: 'italic',
        color: '#213646',
        fontSize: 20,
    },
    wd_transcription_text: {
        color: '#213646',
        fontSize: 20,
        marginLeft: 7
    },
    wd_translation: {
        marginVertical: 15
    },
    wd_translation_text: {
        color: '#213646',
        fontSize: 17
    },
    wd_translation_text_i: {
        color: '#213646',
        fontStyle: 'italic',
        fontSize: 18
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