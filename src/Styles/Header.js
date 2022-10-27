import {StyleSheet} from 'react-native';

export const Headerstyles = StyleSheet.create({
  rectangle: {
    height: 58,
    width: '100%',
    backgroundColor: '#1d415d',

  },
  lines: {
    textAlign: 'center',
    fontSize: 35,
    color: 'white',
  },
  button: {
    height: '100%',
    width: 54,
    justifyContent: 'center',
  },
  input: {
    height: 38,
    width: '72%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  resultItem: {
    marginVertical: 8,
    marginHorizontal: 15,
  },
  resultButton: {
    height: 35,
    justifyContent: 'center',
    flex: 1,
  },
  resultText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'georgia',
  },
});
