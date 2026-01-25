import {StyleSheet} from 'react-native';
import {defaultDark} from '../Global';

export const darkStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: defaultDark.backgroundColor,
  },
  spacer: {
    flex: 1,
  },
  title: {
    marginBottom: 15,
    flexDirection: 'row',
  },
  titleWord: {
    fontFamily: defaultDark.fontFamily,
    color: defaultDark.fontColor,
    fontSize: 24,
  },
  rank: {
    color: defaultDark.grayFont,
    lineHeight: 16,
    marginLeft: 3,
    fontSize: 11,
  },
  ripple: {
    color: defaultDark.rippleColor,
    borderless: true,
    radius: 20,
  },
  flagButton: {
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcriptions: {flexDirection: 'row', flexWrap: 'wrap'},
  transcriptionWord: {
    fontFamily: defaultDark.fontFamily,
    color: defaultDark.grayFont,
    fontSize: 17,
  },
  translation: {
    fontFamily: defaultDark.fontFamily,
    color: defaultDark.fontColor,
    fontSize: 17,
  },
  translationSentence: {
    fontFamily: defaultDark.fontFamily,
    color: defaultDark.fontColor,
    fontSize: 17,
  },
  translationSentenceGray: {
    fontFamily: defaultDark.fontFamily,
    color: defaultDark.grayFont,
    fontSize: 17,
  },
  translationLink: {
    fontFamily: defaultDark.fontFamily,
    color: defaultDark.lightBlueFont,
    fontSize: 17,
  },
  translationItalic: {
    fontFamily: defaultDark.fontFamily,
    fontStyle: 'italic',
    fontSize: 17,
    marginBottom: 10,
    color: defaultDark.lightBlueFont,
  },
  positionNumber: {
    fontFamily: defaultDark.fontFamily,
    color: defaultDark.grayFont,
    fontSize: 16,
    alignSelf: 'flex-end',
  },
  image: {
    width: 14,
    height: 19,
    alignItems: 'center',
  },
});
