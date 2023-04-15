import {useNavigation, useIsFocused} from '@react-navigation/native';
import React, {PureComponent} from 'react';
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
    try {
      dbHistory.transaction(tx => {
        tx.executeSql(
          'SELECT id, word, t_inline, transcription_us, transcription_uk, en_id, ru_id FROM History ORDER BY time DESC',
          [],
          (tx, results) => {
            let temp = [];

            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }

            this.setState({data: temp});
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  navigateOnPress = (word, id) => {
    const {navigation} = this.props;
    try {
      dbHistory.transaction(tx => {
        tx.executeSql('INSERT OR IGNORE INTO History (word) VALUES (?)', [word]);
        tx.executeSql(
          "UPDATE History SET time = '" +
            Math.floor(Date.now() / 1000) +
            "' WHERE word = '" +
            word.toLowerCase() +
            "'",
        );
      });
    } catch (error) {
      console.log(error);
    }
    return navigation.jumpTo(/[A-Za-z]/.test(word) ? 'ResultEn' : 'ResultRu', {word: word, id: id});
    // this.setState({data: []})
  };

  _renderItem = ({item}) => {
    const {id, word, t_inline, transcription_us, transcription_uk, en_id, ru_id} = item;
    const styles = this.props.darkMode ? darkStyles : lightStyles;
    // console.log(word);
    return (
      <View key={id} style={styles.listItem}>
        <Pressable
          onPress={() => this.navigateOnPress(word, en_id ? en_id : ru_id)}
          android_ripple={styles.ripple}
          style={{flex: 1}}>
          <View style={{flexDirection: 'row', flex: 1, marginLeft: 15, marginRight: 55}}>
            <Icon name="history" size={26} style={styles.icon} />
            <Text style={{textAlignVertical: 'center', marginLeft: 15, width: '100%'}}>
              <Text style={styles.text}>{word}</Text>
              {transcription_us ? (
                <Text style={styles.transcription}> |{transcription_us}|</Text>
              ) : null}
              <Text style={styles.translation}> - {t_inline}</Text>
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  keyExtractor = item => item.id.toString();

  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1, paddingVertical: 14}}
          data={this.state.data}
          keyExtractor={this.keyExtractor}
          renderItem={this._renderItem}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'always'}
          initialNumToRender={20}
          windowSize={7}
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
