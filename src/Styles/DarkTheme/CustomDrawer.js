import {StyleSheet} from 'react-native';
import {lightStyles} from '../LightTheme/CustomDrawer';
import {defaultDark} from '../Global';

export const darkStyles = StyleSheet.create({
  image: {
    width: 191,
    height: 24,
    marginBottom: 25,
    marginLeft: 15,
  },
  spacer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    flex: 1,
    overflow: 'hidden',
    borderRadius: 4,
  },
  text: {
    fontSize: 17,
    fontFamily: 'georgia',
    flex: 1,
    marginLeft: 12,
    color: '#fff3d6',
  },
  icon: {color: '#fff3d6', marginLeft: 8},
  ripple: {
    color: defaultDark.rippleColor,
  },
  separator: {
    backgroundColor: '#4F4F4F',
    height: 0.5,
    marginBottom: 4,
  },
});
