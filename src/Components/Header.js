import React, { Component} from 'react';

import { View, Text, Pressable, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Headerstyles } from '../Styles/Header';
import { SearchBar } from '@rneui/themed';
import { Platform} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';


const db = openDatabase({name: 'en_ru_word.db', createFromLocation: 1});

const DATA = [];


class Search extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: DATA,
      error: null,
      searchValue: '',
      searching: false,
      clean: null
    };
    this.arrayholder = DATA;
  }

  async componentDidMount() { 
    await this.fetchData(this.state.searchValue);
  }
  // Попробовать 
  // componentDidMount(prevProps) { 
    // if (this.prevProps !== this.props){

    // }
  // } для очистки поля поиска(сейчас остается крестик, при возврате назад)

  async handleSearch(text) {
    if (text) {
      this.setState({searching: true})
    }
    else {
      this.setState({searching: false})
    };
    this.setState({searchValue: text});
    await this.fetchData(text);
  }

  fetchData(searchValue) {
    var query = "SELECT * FROM en_ru_word WHERE word LIKE '" + searchValue.toLowerCase() + "%' ORDER BY rank LIMIT 10";
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            this.setState({
              data: temp,
            });
      }),
      function (tx, err) {
        Alert.alert('not found')
      }
    })
  }

  _renderItem = ({item}) =>{
    const { navigation } = this.props;
    const { word } = item;
    return(
      <View key={item.id}>
        <View  style={Headerstyles.searchResultItem}>
          <Pressable  
              onPress={() => (
                navigation.jumpTo('Result', {word: word}),
                this.setState({searching: false, searchValue: ''})            
              )
            }>      
                <Text style={{color: '#000', fontSize: 16}}>{word}</Text>
            </Pressable>
          </View>
      </View>        
    )};
 
  render() {
    const { navigation } = this.props;
    const { inputProps } = this.props;

    return (
      <View style={{flexWrap: 'wrap'}}>
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
              renderItem={this._renderItem}
              keyExtractor={(item) => item.id}
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
