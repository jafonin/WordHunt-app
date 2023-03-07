import {StyleSheet} from 'react-native';

export const ResultStyles = StyleSheet.create({
  body: {
    marginTop: 30,
    marginHorizontal: 25,
  },
  title: {
    marginBottom: 15,
    flexDirection: 'row',
  },
  titleWord: {
    fontFamily: 'georgia',
    color: '#213646',
    fontSize: 24,
  },
  rank: {
    color: '#213646',
    lineHeight: 16,
    marginLeft: 3,
    fontSize: 11,
  },
  ripple: {
    color: '#d1d1d1',
    borderless: true,
    radius: 20,
  },
  flagButton: {
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcriptions: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
  },
  transcriptionWord: {
    fontFamily: 'georgia',
    color: '#213646',
    fontSize: 18,
  },
  translation: {
    fontFamily: 'georgia',
    color: '#213646',
    fontSize: 18,
  },
  translationItalic: {
    fontFamily: 'georgia',
    fontStyle: 'italic',
    fontSize: 18,
    marginBottom: 7,
    color: '#0f687e',
  },
  image: {
    width: 14,
    height: 19,
    alignItems: 'center',
  },
});
