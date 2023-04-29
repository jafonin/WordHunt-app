import {StyleSheet} from 'react-native';
import {defaultLight} from '../Global';

export const lightStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: defaultLight.backgroundColor,
  },
  spacer: {
    flex: 1,
  },
  title: {
    marginBottom: 15,
    flexDirection: 'row',
  },
  titleWord: {
    fontFamily: defaultLight.fontFamily,
    color: defaultLight.fontColor,
    fontSize: 24,
  },
  rank: {
    color: defaultLight.fontColor,
    lineHeight: 16,
    marginLeft: 3,
    fontSize: 11,
  },
  ripple: {
    color: defaultLight.rippleColor,
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
    fontFamily: defaultLight.fontFamily,
    color: defaultLight.fontColor,
    fontSize: 18,
  },
  translation: {
    fontFamily: defaultLight.fontFamily,
    color: defaultLight.fontColor,
    fontSize: 18,
  },
  translationLink: {
    fontFamily: defaultLight.fontFamily,
    color: defaultLight.blueFont,
    fontSize: 18,
  },
  translationItalic: {
    fontFamily: defaultLight.fontFamily,
    fontStyle: 'italic',
    fontSize: 18,
    marginBottom: 7,
    color: defaultLight.blueFont,
  },
  positionNumber: {
    fontFamily: defaultLight.fontFamily,
    color: defaultLight.grayFont,
    fontSize: 16,
    alignSelf: 'center',
  },
  image: {
    width: 14,
    height: 19,
    alignItems: 'center',
  },
});
