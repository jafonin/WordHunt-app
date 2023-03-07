import {StyleSheet} from 'react-native';

export const darkStyles = StyleSheet.create({
  rectangle: {
    height: 85,
    width: '100%',
    backgroundColor: '#17344a',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 15,
  },
  threeLines: {
    textAlign: 'center',
    fontSize: 35,
    color: 'white',
  },
  drawerButton: {
    height: '100%',
    width: 60,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#242424',
    width: '78%',
    height: '70%',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
    color: '#000',
    paddingHorizontal: 15,
    fontFamily: 'georgia',
    fontSize: 16,
  },
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
