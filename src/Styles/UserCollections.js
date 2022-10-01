import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    marginTop: 30,
  },
  rectangle: {
    height: 42,
    width: '92%',
    backgroundColor: '#ffefbe',
    borderRadius: 6,
    flexDirection: 'row',
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
  list: {
    marginHorizontal: 15,
    flex: 1,
  },
  listItem: {
    marginVertical: 7,
    flexDirection: 'row',
    flex: 1,
  },
  text: {
    color: '#213646',
    fontFamily: 'georgia',
    fontSize: 17,
  },
});
