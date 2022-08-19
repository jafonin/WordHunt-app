import {StyleSheet} from 'react-native';

export const ResultStyles = StyleSheet.create({
  wd: {
    marginTop: 30,
    marginHorizontal: 25,
  },
  wd_title: {
    marginBottom: 15,
    flexDirection: 'row',
  },
  wd_title_text: {
    fontFamily: 'georgia',
    color: '#213646',
    fontSize: 24,
  },
  wd_transcription: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5
  },
  wd_transcription_text_i: {
    fontFamily: 'georgia',
    fontStyle: 'italic',
    color: '#213646',
    fontSize: 18,
  },
  wd_transcription_text: {
    fontFamily: 'georgia',
    color: '#213646',
    fontSize: 20,
    marginLeft: 7
  },
  wd_translation: {
    marginVertical: 10
  },
  wd_translation_text: {
    fontFamily: 'georgia',
    color: '#213646',
    fontSize: 17,
  },
  wd_translation_text_i: {
    fontFamily: 'georgia',
    color: '#213646',
    fontStyle: 'italic',
    fontSize: 18,
    marginBottom: 7,
    color: '#0f687e',
  },
  rank: {
    color: '#213646',
    lineHeight: 16,
    marginLeft: 3,
    fontSize: 11,
  },
  img: {
    width: 14,
    height: 19,
    alignItems: 'center',
  },
});
