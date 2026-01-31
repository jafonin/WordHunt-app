import {StyleSheet} from 'react-native';
import {defaultLight} from '../Global';

export const lightStyles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: '#004150',
    fontFamily: defaultLight.fontFamily,
    fontWeight: '800',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#1a1a1a',
    fontFamily: defaultLight.fontFamily,
    marginBottom: 13,
  },
  spacer: {
    marginTop: 20,
    marginLeft: 25,
    flexWrap: 'wrap',
  },
  body: {
    backgroundColor: defaultLight.backgroundColor,
    flex: 1,
  },
});
