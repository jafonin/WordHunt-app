import {StyleSheet} from 'react-native';
import {lightStyles} from '../LightTheme/Settings';
import {defaultLight} from '../Global';

export const darkStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: defaultDark.backgroundColor,
  },
  spacer: {
    marginTop: 30,
    marginHorizontal: 25,
  },
});
