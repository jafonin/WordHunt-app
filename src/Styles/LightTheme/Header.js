import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {defaultLight} from '../Global';

export const lightStyles = StyleSheet.create({
  rectangle: {
    height: StatusBar.currentHeight + 55,
    width: '100%',
    backgroundColor: '#1d415d',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 15,
  },
  ripple: {
    color: defaultLight.rippleColor,
  },
  spacer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  threeLines: {
    textAlign: 'center',
    fontSize: 35,
    color: '#f5f5f5',
  },
  drawerButton: {
    height: '100%',
    width: 55,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: defaultLight.backgroundColor,
    width: '90%',
    justifyContent: 'center',
    textAlignVertical: 'center',
    paddingVertical: 0,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontFamily: defaultLight.fontFamily,
    fontSize: 16,
    color: defaultLight.fontColor,
  },
  inputBackgroud: {
    marginRight: 65,
    height: '70%',
    alignContent: 'center',
    backgroundColor: defaultLight.backgroundColor,
    flexDirection: 'row',
    borderRadius: 6,
  },
  clearButton: {
    color: defaultLight.fontColor,
  },
  itemButton: {
    height: 55,
    justifyContent: 'center',
    flex: 1,
  },
  itemText: {
    color: defaultLight.fontColor,
    fontSize: 17,
    fontFamily: defaultLight.fontFamily,
    marginLeft: 15,
    width: '100%',
  },
  icon: {
    color: defaultLight.fontColor,
    marginLeft: 2,
    textAlignVertical: 'center',
  },
});
