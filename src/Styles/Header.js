import {StyleSheet} from 'react-native';

export const Headerstyles = StyleSheet.create({
  rectangle: {
    height: 85,
    width: '100%',
    backgroundColor: '#1d415d',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 15,
  },
  lines: {
    textAlign: 'center',
    fontSize: 35,
    color: 'white',
  },
  drawerButton: {
    height: '100%',
    width: 60,
    justifyContent: 'center',
  },
  // input: {
  //   height: 38,
  //   width: '72%',
  //   maxWidth: 500,
  //   backgroundColor: '#fff',
  //   borderRadius: 6,
  // },
  item: {
    marginVertical: 8,
  },
  itemButton: {
    height: 35,
    justifyContent: 'center',
    flex: 1,
  },
  itemText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'georgia',
  },
});
