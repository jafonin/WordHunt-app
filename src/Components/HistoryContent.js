import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Component} from 'react';
import {StyleSheet, View, Text, FlatList, Pressable} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const dbHistory = openDatabase({name: 'UserHistory.db', createFromLocation: 1});

class HistoryContent extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.searchValue !== this.state.searchValue) {
      await this.fetchData();
    }
  }

  fetchData() {
    var query = 'SELECT * FROM History LIMIT 10';
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
      navigation.jumpTo(this.state.goTo, {word: word}),
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
            <Text style={{color: '#000'}} numberOfLines={1}>
              {word} - {t_inline}
            </Text>
          </Pressable>
        </View>
      );
    }
  };
  render() {
    return (
      <View style={{marginTop: 2}}>
        <FlatList
          data={this.state.data}
          keyExtractor={item => item.id}
          windowSize={1}
          renderItem={this._renderItem}
          style={{height: '100%', marginTop: 20}}
        />
      </View>
    );
  }
}

export default HistoryContent;
