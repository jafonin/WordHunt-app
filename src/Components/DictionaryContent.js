import {useNavigation, useIsFocused} from '@react-navigation/native';
import React from 'react';
import {PureComponent} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {styles} from '../Styles/UserCollections';

const dbDic = openDatabase({name: 'UserDictionary.db', createFromLocation: 1});
const dbHistory = openDatabase({name: 'UserHistory.db', createFromLocation: 1});

class _renderDictionary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.fetchData();
    }
  }

  fetchData() {
    var query = 'SELECT * FROM dictionary ORDER BY id DESC';
    try {
      dbDic.transaction(tx => {
        tx.executeSql(query, [], (tx, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({data: temp});
          //   console.log(this.state.data)
        }),
          function (tx, err) {
            alert('not found'); // НЕ РАБОТАЕТ
          };
      });
    } catch (error) {
      console.log(error);
    }
  }

  navigateOnPress = (word, t_inline) => {
    const {navigation} = this.props;
    let currentDate = new Date().toLocaleString();
    try {
      dbHistory.transaction(tx => {
        tx.executeSql(
          'INSERT OR IGNORE INTO History (word, t_inline) VALUES (?,?)',
          [word, t_inline],
        );
        tx.executeSql(
          "UPDATE History SET time = '" +
            currentDate.toLowerCase() +
            "' WHERE word = '" +
            word.toLowerCase() +
            "'",
        );
      });
    } catch (error) {
      console.log(error);
    }
    return (
      /[A-Za-z]/.test(word) && navigation.jumpTo('ResultEn', {word: word}), //Исправить state.goTO
      /[А-Яа-я]/.test(word) && navigation.jumpTo('ResultRu', {word: word}),
      this.setState({data: []})
    );
  };

  _renderItem = ({item}) => {
    const {word} = item;
    const {id} = item;
    const {t_inline} = item;
    const {transcription_us} = item;
    const {transcription_uk} = item;
    if (transcription_uk || transcription_us) {
      return (
        <View key={id} style={styles.listItem}>
          <Pressable onPress={() => this.navigateOnPress(word)}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text>
                <Text style={[styles.text, {textDecorationLine: 'underline'}]}>
                  {word}
                </Text>
                {transcription_us && (
                    <Text style={styles.text}> |{transcription_us}|</Text>
                  )}
                  <Text style={styles.text}> - {t_inline}</Text>
              </Text>
            </View>
          </Pressable>
        </View>
      );
    } else {
      return (
        <View key={id} style={styles.listItem}>
          <Pressable onPress={() => this.navigateOnPress(word)}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text>
                <Text style={[styles.text, {textDecorationLine: 'underline'}]}>
                  {word}
                </Text>
                <Text style={styles.text}> - {t_inline}</Text>
              </Text>
            </View>
          </Pressable>
        </View>
      );
    }
  };
  render() {
    return (
      <View style={styles.list}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={this.state.data}
          keyExtractor={item => item.id}
          renderItem={this._renderItem}
          style={{marginTop: 20}}
          windowSize={5}
        />
      </View>
    );
  }
}

export default function DictionaryContent(props) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  return (
    <_renderDictionary
      {...props}
      isFocused={isFocused}
      navigation={navigation}
    />
  );
}
