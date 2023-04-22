import {StyleSheet} from 'react-native';
import {darkStyles} from '../DarkTheme/Settings';
import {defaultLight} from '../Global';

export const lightStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: defaultLight.backgroundColor,
  },
  spacer: {
    marginTop: 30,
    marginHorizontal: 25,
  },
});
