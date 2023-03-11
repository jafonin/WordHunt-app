import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {defaultLight} from '../Global';

export const lightStyles = StyleSheet.create({
  rectangle: {
    height: StatusBar.currentHeight + 55,
    width: '100%',
    backgroundColor: '#1d415d',
    shadowColor: '#000000',
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
    backgroundColor: '#fff',
    width: '80%',
    height: '70%',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
    color: '#1a1a1a',
    paddingHorizontal: 15,
    fontFamily: 'georgia',
    fontSize: 16,
  },
  itemButton: {
    height: 55,
    justifyContent: 'center',
    flex: 1,
  },
  itemText: {
    color: '#1a1a1a',
    fontSize: 17,
    fontFamily: 'georgia',
    marginLeft: 15,
    width: '100%',
  },
  icon: {
    color: '#1a1a1a',
    marginLeft: 2,
    textAlignVertical: 'center',
  },
});
