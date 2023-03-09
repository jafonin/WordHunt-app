import {useNavigation, useIsFocused} from '@react-navigation/native';
import React from 'react';
import {PureComponent} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {lightStyles} from '../Styles/LightTheme/UserCollections';
import {darkStyles} from '../Styles/DarkTheme/UserCollections';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    var query = 'SELECT * FROM History ORDER BY time DESC';
    try {
      dbHistory.transaction(tx => {
        tx.executeSql(query, [], (tx, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({data: temp});
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  navigateOnPress = (word, id) => {
    const {navigation} = this.props;
    let currentDate = new Date().toLocaleString();
    try {
      dbHistory.transaction(tx => {
        tx.executeSql('INSERT OR IGNORE INTO History (word) VALUES (?)', [word]);
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
      navigation.jumpTo(/[A-Za-z]/.test(word) ? 'ResultEn' : 'ResultRu', {word: word, id: id}),
      this.setState({data: []})
    );
  };

  _renderItem = ({item}) => {
    const {word} = item;
    const {id} = item;
    const {t_inline} = item;
    const {transcription_us} = item;
    const {transcription_uk} = item;
    const {en_id} = item;
    const {ru_id} = item;
    const styles = this.props.darkMode ? darkStyles : lightStyles;
    return (
      <View key={id} style={styles.listItem}>
        <Pressable
          onPress={() => this.navigateOnPress(word, en_id ? en_id : ru_id)}
          android_ripple={{color: '#d1d1d1'}}
          style={{flex: 1}}>
          <View style={{flexDirection: 'row', flex: 1, marginLeft: 12, marginRight: 55}}>
            <Icon
              name="history"
              size={26}
              style={{color: '#c7c7c7', textAlignVertical: 'center'}}
            />
            <Text
              style={{
                textAlignVertical: 'center',
                marginLeft: 15,
                width: '100%',
              }}>
              <Text style={styles.text}>{word}</Text>
              {transcription_us ? (
                <Text style={[styles.text, {color: '#eee'}]}> |{transcription_us}|</Text>
              ) : null}
              <Text style={[styles.text, {color: '#888'}]}> - {t_inline}</Text>
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1, paddingVertical: 14}}
          data={this.state.data}
          keyExtractor={item => item.id}
          renderItem={this._renderItem}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'always'}
        />
      </View>
    );
  }
}

export default function HistoryContent({darkMode, ...props}) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  return (
    <_renderHistory {...props} isFocused={isFocused} navigation={navigation} darkMode={darkMode} />
  );
}
