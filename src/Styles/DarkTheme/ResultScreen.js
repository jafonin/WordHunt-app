import {StyleSheet} from 'react-native';
import {defaultDark} from '../Global';

export const darkStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: defaultDark.backgroundColor,
  },
  spacer: {
    marginTop: 30,
    marginHorizontal: 20,
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
    color: defaultDark.fontColor,
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
  transcriptions: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
  },
  transcriptionWord: {
    fontFamily: defaultDark.fontFamily,
    color: defaultDark.fontColor,
    fontSize: 18,
  },
  translation: {
    fontFamily: defaultDark.fontFamily,
    color: defaultDark.fontColor,
    fontSize: 18,
  },
  translationLink: {
    fontFamily: defaultDark.fontFamily,
    color: defaultDark.lightBlueFont,
    fontSize: 18,
  },
  translationItalic: {
    fontFamily: defaultDark.fontFamily,
    fontStyle: 'italic',
    fontSize: 18,
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
