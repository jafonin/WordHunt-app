import React, {PureComponent} from 'react';
import {View, Text, Pressable, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Headerstyles} from '../Styles/Header';
import {SearchBar} from '@rneui/themed';
import {Platform} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

// const dbEn = openDatabase({name: 'ru_en_word.db', createFromLocation: 1});
const db = openDatabase({name: 'ru_en_word.db', createFromLocation: 1});
const dbHistory = openDatabase({name: 'UserHistory.db', createFromLocation: 1});

class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchValue: '',
      searching: false,
      updateItem: false,
      goTo: '',
    };
  }

  // componentDidMount() {
  //   if (this.state.searchValue) {
  //     this.fetchData(this.state.searchValue);
  //   }
  // }
  // Попробовать
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.searchValue !== this.state.searchValue){
  //     this.setState({updateItem: true});
  //     // this.fetchData(this.state.searchValue);
  //   }
  //   // else {
  //   //   this.setState({updateItem: false});
  //   // }
  // }
  // для очистки поля поиска(сейчас остается крестик, при возврате назад)

  handleSearch(text) {
    if (text) {
      this.setState({searching: true});
    } else {
      this.setState({searching: false, data: []});
    }
    this.setState({searchValue: text});
    this.fetchData(text);
  }

  fetchData = async(searchValue) => {
    if (searchValue) {
      if (/[A-Za-z]/.test(searchValue)) {
        var query =
          "SELECT id, word, t_inline, transcription_us, transcription_uk FROM en_ru_word WHERE t_mix IS NOT '' AND word LIKE '" +
          searchValue.toLowerCase() +
          "%' ORDER BY rank LIMIT 10";
        // var db = dbEn;
        this.setState({goTo: 'ResultEn'});
      } else {
        var query =
          "SELECT id, word, t_inline, lemma FROM ru_en_word WHERE word LIKE '" +
          searchValue.toLowerCase() +
          "%' ORDER BY rank LIMIT 10";
        // var db = dbRu;
        this.setState({goTo: 'ResultRu'});
      }
      try {
        await db.transaction(async tx => {
          await tx.executeSql(query, [], (tx, results) => {
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
      } catch (error) {
        console.log(error);
      }
    }
  }

  setData = async (word, t_inline, transcription_us, transcription_uk) => {
    let currentDate = new Date().toLocaleString();
    try {
      await dbHistory.transaction(async tx => {
        await tx.executeSql(
          'INSERT OR IGNORE INTO History (word, t_inline, transcription_us, transcription_uk) VALUES (?,?,?,?)',
          [word, t_inline, transcription_us, transcription_uk],
        );
        await tx.executeSql(
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
  };

  navigateOnPress = (id, word, t_inline, transcription_us, transcription_uk) => {
    const {navigation} = this.props;
    this.setData(word, t_inline, transcription_us, transcription_uk);
    return (
      navigation.jumpTo(this.state.goTo, {word: word, id: id}),
      this.setState({searching: false, searchValue: null, data: []})
    );
  };

  _renderItem = ({item}) => {
    const {word} = item;
    const {id} = item;
    const {t_inline} = item;
    const {transcription_us} = item;
    const {transcription_uk} = item;
    if (t_inline) {
      return (
        <View key={id} style={Headerstyles.resultItem}>
          <Pressable
            style={Headerstyles.resultButton}
            onPress={() =>
              this.navigateOnPress(
                id,
                word,
                t_inline,
                transcription_us,
                transcription_uk,
              )
            }>
            <Text style={Headerstyles.resultText} numberOfLines={1}>
              {word} - {t_inline}
            </Text>
          </Pressable>
        </View>
      );
    }
  };

  render() {
    const {navigation} = this.props;
    const {inputProps} = this.props;
    return (
      <View>
        <View style={Headerstyles.rectangle}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={Headerstyles.button}>
              <Text style={Headerstyles.lines}>≡</Text>
            </Pressable>
            {/* Не работает перемещение по тексту */}
            <SearchBar 
              placeholder="Поиск по словарю"
              platform={inputProps}
              ref={search => (this.search = search)}
              placeholderTextColor="#888"
              containerStyle={{
                width: '75%',
                height: '78%',
                justifyContent: 'center',
                borderRadius: 5,
                marginLeft: '2%',
              }}
              value={this.state.searchValue}
              onChangeText={text => this.handleSearch(text)}
            />
          </View>
        </View>
        {this.state.searching && (
          <FlatList
            data={this.state.data}
            keyExtractor={item => item.id}
            windowSize={1}
            renderItem={this._renderItem}
            style={{height: '100%', marginTop: 20}}
          />
        )}
      </View>
    );
  }
}

export default function Header(props) {
  const navigation = useNavigation();
  const inputProps = Platform.select({
    android: 'android',
    ios: 'ios',
  });
  return <Search {...props} navigation={navigation} inputProps={inputProps} />;
}
