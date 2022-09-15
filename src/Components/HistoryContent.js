import {useNavigation, useIsFocused} from '@react-navigation/native';
import React from 'react';
import {PureComponent} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {styles} from '../Styles/UserCollections';

const dbHistory = openDatabase({name: 'UserHistory.db', createFromLocation: 1});

class _renderHistory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {data: [], goTo: ''};
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
    var query = 'SELECT * FROM History ORDER BY id DESC';
    dbHistory.transaction(tx => {
      tx.executeSql(query, [], (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({data: temp});
      }),
        function (tx, err) {
          alert('not found'); // НЕ РАБОТАЕТ
        };
    });
  }

  navigateOnPress = (word, t_inline) => {
    const {navigation} = this.props;
    try {
      dbHistory.transaction(async tx => {
        tx.executeSql('INSERT INTO History (word, t_inline) VALUES (?,?)', [
          word,
          t_inline,
        ]);
      });
    } catch (error) {
      console.log(error);
    }
    return (
      /[A-Za-z]/.test(word) && navigation.jumpTo('ResultEn', {word: word}),//Исправить state.goTO
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
    if (t_inline) {
      // console.log(word);
      return (
        <View key={id} style={styles.listItem}>
          <Pressable onPress={() => this.navigateOnPress(word)}>
            {(transcription_us || transcription_uk) && (
              <View style={{flexDirection: 'row', flex: 1}}>
              <Text>
                <Text
                  style={{
                    color: '#213646',
                    fontFamily: 'georgia',
                    fontSize: 17,
                    textDecorationLine: 'underline',
                  }}>
                  {word}
                </Text>
                <Text
                  style={{
                    color: '#213646',
                    fontFamily: 'georgia',
                    fontSize: 17,
                  }}>
                  {'\ '}|{transcription_us}| - {t_inline}
                </Text>
              </Text>
            </View>
            )}
            {!(transcription_us || transcription_uk) && (
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text>
                  <Text
                    style={{
                      color: '#213646',
                      fontFamily: 'georgia',
                      fontSize: 17,
                      textDecorationLine: 'underline',
                    }}>
                    {word}
                  </Text>
                  <Text
                    style={{
                      color: '#213646',
                      fontFamily: 'georgia',
                      fontSize: 17,
                    }}>
                    {'\ '}- {t_inline}
                  </Text>
                </Text>
              </View>
            )}
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
          // windowSize={21}
        />
      </View>
    );
  }
}

export default function HistoryContent(props) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  return <_renderHistory {...props} isFocused={isFocused} navigation={navigation}/>;
}
