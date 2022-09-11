import {useNavigation, useIsFocused} from '@react-navigation/native';
import React from 'react';
import {PureComponent} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const dbHistory = openDatabase({name: 'UserHistory.db', createFromLocation: 1});

class _renderHistory extends PureComponent {
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
    var query = 'SELECT * FROM History ORDER BY id DESC';
    dbHistory.transaction(tx => {
      tx.executeSql(query, [], (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({data: temp});
        console.log(data);
      }),
        function (tx, err) {
          alert('not found'); // НЕ РАБОТАЕТ
        };
    });
  }

  navigateOnPress = (word, t_inline) => {
    const navigation = useNavigation();
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
      navigation.jumpTo(this.state.goTo, {word: word}), //Исправить state.goTO
      this.setState({searching: false, searchValue: '', data: []})
    );
  };

  _renderItem = ({item}) => {
    const {word} = item;
    const {id} = item;
    const {t_inline} = item;
    if (t_inline) {
      console.log(word);
      return (
        <View key={id}>
          <Pressable onPress={() => this.navigateOnPress(word)}>
            <Text
              style={{color: '#213646', fontFamily: 'georgia', fontSize: 18}}
              numberOfLines={1}>
              {word} - {t_inline}
            </Text>
          </Pressable>
        </View>
      );
    }
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={this.state.data}
          keyExtractor={item => item.id}
          renderItem={this._renderItem}
          style={{marginTop: 20}}
        />
      </View>
    );
  }
}

export default function HistoryContent(props) {
  const isFocused = useIsFocused();
  return <_renderHistory {...props} isFocused={isFocused} />;
}
