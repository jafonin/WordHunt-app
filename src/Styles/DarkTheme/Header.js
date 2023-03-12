import {StyleSheet} from 'react-native';
import {lightStyles} from '../LightTheme/Header';
import {defaultDark} from '../Global';

export const darkStyles = StyleSheet.create({
  rectangle: [
    lightStyles.rectangle,
    {
      backgroundColor: '#17344a',
      shadowColor: '#888',
    },
  ],
  ripple: {
    color: defaultDark.rippleColor,
  },
  spacer: lightStyles.spacer,
  threeLines: lightStyles.threeLines,
  drawerButton: lightStyles.drawerButton,
  input: {
    backgroundColor: defaultDark.backgroundColor,
    width: '90%',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontFamily: defaultDark.fontFamily,
    fontSize: 16,
    color: defaultDark.fontColor,
  },
  inputBackgroud: {
    width: '80%',
    height: '70%',
    alignContent: 'center',
    backgroundColor: defaultDark.backgroundColor,
    flexDirection: 'row',
    borderRadius: 6,
  },
  clearButton: {
    color: defaultDark.grayFont,
  },
  itemButton: lightStyles.itemButton,
  itemText: [
    lightStyles.itemText,
    {
      color: '#aaaaaa',
    },
  ],
  icon: [
    lightStyles.icon,
    {
      color: '#c7c7c7',
    },
  ],
});
