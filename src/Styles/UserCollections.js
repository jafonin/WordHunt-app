import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
  },
  rectangle: {
    height: 42,
    width: '92%',
    backgroundColor: '#ffefbe',
    marginTop: 30,
    borderRadius: 6,
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    color: '#583627',
    fontWeight: '700',
    height: '100%',
    textAlignVertical: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '2%',
    width: '46%',
    height: '100%',
  },
  thisButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '2%',
    width: '46%',
    height: '100%',
    backgroundColor: '#ffdca9',
    borderRadius: 6,
  },
  // list: {
  //   flex: 1,
  // },
  listItem: {
    marginTop: 14,
    marginHorizontal: 18,
    flexDirection: 'row',
    flex: 1,
  },
  text: {
    color: '#213646',
    fontFamily: 'georgia',
    fontSize: 17,
  },
});
