import {StyleSheet} from 'react-native';
import {defaultDark} from '../Global';

export const darkStyles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: '#6d93b0',
    fontFamily: defaultDark.fontFamily,
    fontWeight: '800',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: defaultDark.fontColor,
    fontFamily: defaultDark.fontFamily,
    marginBottom: 13,
  },
  spacer: {
    marginTop: 20,
    marginLeft: 25,
    flexWrap: 'wrap',
  },
  body: {
    backgroundColor: defaultDark.backgroundColor,
    flex: 1,
  },
});
