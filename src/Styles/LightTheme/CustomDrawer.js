import {StyleSheet} from 'react-native';
import {darkStyles} from '../LightTheme/CustomDrawer';
import {defaultLight} from '../Global';

export const lightStyles = StyleSheet.create({
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
    color: '#583627',
  },
  icon: {color: '#583627', marginLeft: 8},
  ripple: {
    color: defaultLight.rippleColor,
  },
  separator: {
    backgroundColor: '#BFBFBF',
    height: 0.5,
    marginBottom: 4,
  },
});
