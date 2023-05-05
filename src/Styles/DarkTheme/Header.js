import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {lightStyles} from '../LightTheme/Header';
import {defaultDark} from '../Global';

export const darkStyles = StyleSheet.create({
  rectangle: {
    height: StatusBar.currentHeight + 55,
    width: '100%',
    backgroundColor: '#17344a',
    shadowColor: '#888',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 15,
  },
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
    textAlignVertical: 'center',
    paddingVertical: 0,
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
  itemText: {
    fontSize: 17,
    fontFamily: defaultDark.fontFamily,
    marginLeft: 15,
    width: '100%',
    color: '#aaa',
  },
  icon: {
    marginLeft: 2,
    textAlignVertical: 'center',
    color: '#c7c7c7',
  },
});
