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
    this.state = {data: [], isEmpty: false};
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.fetchData();
      this.setState({isEmpty: false});
    }
  }

  fetchData = async () => {
    try {
      await dbHistory.transaction(async tx => {
        await tx.executeSql(
          'SELECT id, word, t_inline, transcription_us, transcription_uk, en_id, ru_id FROM History ORDER BY time DESC',
          [],
          (tx, results) => {
            let temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            results.rows.length == 0 ? this.setState({isEmpty: true}) : this.setState({data: temp});
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  navigateOnPress = async (word, id) => {
    const {navigation} = this.props;
    try {
      await dbHistory.transaction(async tx => {
        await tx.executeSql(
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
    return navigation.navigate(/[A-Za-z]/.test(word) ? 'ResultEn' : 'ResultRu', {
      word: word,
      id: id,
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

  renderEmptyList = styles => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 0.8}}>
        <Text style={styles.text}>Здесь появится история запросов</Text>
      </View>
    );
  };

  keyExtractor = item => item.id.toString();

  render() {
    const styles = this.props.darkMode ? darkStyles : lightStyles;
    // debugger;
    return (
      <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1, paddingVertical: 14}}
          data={this.state.data}
          keyExtractor={this.keyExtractor}
          renderItem={item => this.renderItem(item, styles)}
          ListEmptyComponent={this.state.isEmpty ? this.renderEmptyList(styles) : null}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'always'}
          initialNumToRender={20}
          windowSize={15}
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
