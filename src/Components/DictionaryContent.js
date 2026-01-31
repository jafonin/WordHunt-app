import {useNavigation, useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {PureComponent} from 'react';
import {View, Text, FlatList, Pressable, Alert} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {lightStyles} from '../Styles/LightTheme/UserCollections';
import {darkStyles} from '../Styles/DarkTheme/UserCollections';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {setData} from './AddToHistory';
import Animated from 'react-native-reanimated';

const dbDic = openDatabase({name: 'UserDictionary.db', createFromLocation: 1});

class _renderDictionary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.fetchData();
    }
  }

  fetchData() {
    var query = 'SELECT * FROM dictionary ORDER BY time DESC';
    try {
      dbDic.transaction(tx => {
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
    return (
      this.props.navigation.jumpTo(/[A-Za-z]/.test(word) ? 'ResultEn' : 'ResultRu', {
        word: word,
        id: id,
      }),
      this.setState({data: []})
    );
  };

  deleteFromDictionary = (word, {item}) => {
    const newItems = this.state.data.filter(i => i.id !== item.id);
    this.setState({data: newItems});
    return dbDic.transaction(tx => {
      tx.executeSql("DELETE FROM dictionary WHERE word = '" + word + "'", []);
    });
  };

  renderItem = ({item}, styles) => {
    const {id, word, t_inline, transcription_us, transcription_uk, en_id, ru_id} = item;
    return (
      <View key={id} style={styles.listItem}>
        <Pressable
          onPress={() => this.navigateOnPress(word, en_id ? en_id : ru_id)}
          android_ripple={styles.ripple}
          style={{flex: 1}}>
          <View style={{flexDirection: 'row', flex: 1, marginLeft: 25}}>
            <Text style={{textAlignVertical: 'center', width: '100%'}}>
              <Text style={styles.text}>{word}</Text>
              {transcription_us && <Text style={styles.transcription}> |{transcription_us}|</Text>}
              <Text style={styles.translation}> - {t_inline}</Text>
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            Alert.alert(
              '',
              'Вы уверны?',
              [
                {text: 'Отмена', onPress: () => {}, style: 'cancel'},
                {text: 'OK', onPress: () => this.deleteFromDictionary(word, {item})},
              ],
              {cancelable: true, userInterfaceStyle: this.props.darkMode ? 'dark' : 'light'},
            );
          }}
          style={{justifyContent: 'center', marginLeft: 5, marginRight: 15}}
          android_ripple={{color: styles.ripple.color, borderless: true, radius: 20}}>
          <Icon name="delete" size={24} style={[styles.icon]} />
        </Pressable>
      </View>
    );
  };

  renderEmptyList = styles => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 0.8}}>
        <Text style={styles.text}>Здесь появится Ваш словарь</Text>
      </View>
    );
  };

  keyExtractor = item => item.id.toString();

  render() {
    const styles = this.props.darkMode ? darkStyles : lightStyles;
    return (
      <View style={{flex: 1}}>
        <Animated.FlatList
          contentContainerStyle={{flexGrow: 1, paddingVertical: 14}}
          data={this.state.data}
          keyExtractor={this.keyExtractor}
          renderItem={item => this.renderItem(item, styles)}
          ListEmptyComponent={this.renderEmptyList(styles)}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'always'}
          initialNumToRender={20}
          windowSize={7}
        />
      </View>
    );
  }
}

export default function DictionaryContent({darkMode, ...props}) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  return (
    <_renderDictionary
      {...props}
      isFocused={isFocused}
      navigation={navigation}
      darkMode={darkMode}
    />
  );
}
