import React, { PureComponent } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Headerstyles } from '../Styles/Header';
import { SearchBar } from '@rneui/themed';
import { Platform} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({name: 'en_ru_word.db', createFromLocation: 1});

class Search extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      searchValue: '',
      searching: false,
      updateItem: false
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
    }
    else {
      this.setState({searching: false, data: []});
    };
    this.setState({searchValue: text});
    this.fetchData(text);
  }

  fetchData(searchValue) {
    if (searchValue) {
      var query = "SELECT id, word, t_inline FROM en_ru_word WHERE word LIKE '" + searchValue.toLowerCase() + "%' ORDER BY rank LIMIT 10";
      db.transaction((tx) => {
        tx.executeSql(query, [], (tx, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({ data: temp });
        }),
        function (tx, err) {
          alert('not found') // НЕ РАБОТАЕТ
        }
      })
    }
  }

  _renderItem = ({item}) => {
    const { navigation } = this.props;
    const { word } = item;
    const { id } = item;
    const { t_inline } = item;
    return(
      <View key={id} style={Headerstyles.ResultItem}>
          <Pressable
            style={Headerstyles.resultButton}
              onPress={() => (
                navigation.jumpTo('Result', {word: word}),
                this.setState({searching: false, searchValue: ''})
              )
            }>
                <Text
                  style={{color: '#000', fontSize: 18}}
                  numberOfLines={1}>
                    {/* НЕ ДЛЯ ВСЕХ СЛОВ ЕСТЬ ПЕРЕВОД, НАПР 4g */}
                    {word} - {t_inline}
                </Text>
          </Pressable>
      </View>
    )
  };

  render() {
    const { navigation } = this.props;
    const { inputProps } = this.props;
    return (
      <View>
        <View style={Headerstyles.rectangle}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={Headerstyles.button}>
            <Text style={Headerstyles.lines}>≡</Text>
          </Pressable>
          <SearchBar
            placeholder='Поиск по словарю'
            platform={inputProps}
            placeholderTextColor='#888'
            containerStyle={{
              width: '75%',
              height: '78%',
              justifyContent: 'center',
              borderRadius: 5,
              marginLeft: '2%',
            }}
            value={this.state.searchValue}
            onChangeText={(text) => this.handleSearch(text)}
          />
        </View>
      </View>
          {this.state.searching &&
            <FlatList
              data={this.state.data}
              keyExtractor={(item) => item.id}
              windowSize={1}
              renderItem={this._renderItem}
              style={{height: '100%', marginTop: 20}}
              />
            }
    </View>
    );
  }
};

export default function Header(props) {
  const navigation = useNavigation();
  const inputProps = Platform.select({
    android: 'android',
    ios: 'ios',
  });
  return <Search {...props} navigation={navigation} inputProps={inputProps}/>;
};
