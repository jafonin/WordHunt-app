import {StyleSheet} from 'react-native';
import {defaultDark} from '../Global';

export const darkStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: defaultDark.backgroundColor,
  },
  spacer: {
    alignItems: 'center',
  },
  rectangle: {
    height: 42,
    width: '92%',
    backgroundColor: '#ffefbe',
    marginTop: 30,
    borderRadius: 6,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  screenName: {
    color: '#583627',
    fontWeight: '700',
    height: '100%',
    textAlignVertical: 'center',
    fontFamily: defaultDark.fontFamily,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '2%',
    width: '46%',
    height: '100%',
  },
  ripple: {
    color: defaultDark.rippleColor,
  },
  icon: {
    color: '#c7c7c7',
    textAlignVertical: 'center',
  },
  listItem: {
    marginVertical: 4,
    // marginHorizontal: 18,
    flexDirection: 'row',
    flex: 1,
    minHeight: 42,
  },
  text: {
    color: defaultDark.fontColor,
    fontFamily: defaultDark.fontFamily,
    fontSize: 17,
  },
  transcription: {
    color: defaultDark.fontColor,
    fontFamily: defaultDark.fontFamily,
    fontSize: 17,
  },
  translation: {
    color: '#aaa',
    fontFamily: defaultDark.fontFamily,
    fontSize: 17,
  },
});
