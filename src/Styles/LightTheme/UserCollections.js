import {StyleSheet} from 'react-native';
import {defaultLight} from '../Global';

export const lightStyles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#fff'},
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
    fontFamily: defaultLight.fontFamily,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '2%',
    width: '46%',
    height: '100%',
  },
  ripple: {
    color: defaultLight.rippleColor,
  },
  icon: {
    color: defaultLight.fontColor,
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
    color: defaultLight.fontColor,
    fontFamily: defaultLight.fontFamily,
    fontSize: 17,
  },
  transcription: {
    color: defaultLight.fontColor,
    fontFamily: defaultLight.fontFamily,
    fontSize: 17,
  },
  translation: {
    color: defaultLight.fontColor,
    fontFamily: defaultLight.fontFamily,
    fontSize: 17,
  },
});
