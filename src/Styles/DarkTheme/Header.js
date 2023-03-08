import {StyleSheet} from 'react-native';
import {lightStyles} from '../LightTheme/Header';

export const darkStyles = StyleSheet.create({
  rectangle: [
    lightStyles.rectangle,
    {
      backgroundColor: '#17344a',
      shadowColor: '#888',
    },
  ],
  spacer: lightStyles.spacer,
  threeLines: lightStyles.threeLines,
  drawerButton: lightStyles.drawerButton,
  input: {
    backgroundColor: '#242424',
    width: '80%',
    height: '70%',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontFamily: 'georgia',
    fontSize: 16,
    color: '#f5f5f5',
  },
  itemButton: lightStyles.itemButton,
  itemText: [
    lightStyles.itemText,
    {
      color: '#969696',
    },
  ],
  icon: [
    lightStyles.icon,
    {
      color: '#c7c7c7',
    },
  ],
});
