import React, { Component, useState } from 'react';

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
    // var query = "SELECT * FROM test WHERE word = 'one'";
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            this.setState({
              data: temp,
            });
        // console.log(temp);
      }),
      function (tx, err) {
        Alert.alert('not found')
      }
    })
  }
  
  // searchFunction = (text) => {
  //   if (text) {
  //     this.setState({searching: true})
  //   }
  //   else {
  //     this.setState({searching: false})
  //   }

  //   const updatedData = this.arrayholder.filter((item) => {
  //     const item_data = `${item.title.toUpperCase()})`;
  //     const text_data = text.toUpperCase();
  //     return item_data.indexOf(text_data) > -1;
  //   });
  //   this.setState({ data: updatedData, searchValue: text });
  // }

  _renderItem = ({item}) =>{
    const { navigation } = this.props;
    const word = item.word;
    return(
      <View key={item.id}>
        <View  style={Headerstyles.searchResultItem}>
          <Pressable  
              onPress={() => (
                navigation.jumpTo('Result', {_word: {word}}),
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
    // const _renderItem = this.state.data.map((item) =>
      // <View key={item.id}>
      //   <View  style={Headerstyles.searchResultItem}>
      //     <Pressable  
      //       onPress={() => (
      //         navigation.jumpTo('WordPage', {word: {title}}),
      //         this.setState({searching: false, searchValue: ''})            
      //       )
      //     }>      
      //       <Text style={{color: '#000', fontSize: 16}}>{item.title}</Text>              
      //     </Pressable>
      //   </View>
      // </View>
    // );

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

/*
 function Header() {
  const navigation = useNavigation();
  const inputProps = Platform.select({
    android: "android",
    ios: "ios",
  });
  const [dataSource] = useState(['apple', 'banana', 'cow', 'dex', 'zee', 'orange', 'air', 'bottle']);
  

  const [filtered, setFiltered] = useState(dataSource);
  const [searching, setSearching] = useState(false);
  const onSearch = (text) => {
    if (text) {
      setSearching(true)
      const temp = text.toLowerCase()  
      const tempList = dataSource.filter(item => {
        if (item.match(temp))
          return item
      })
      setFiltered(tempList)
    }
    else {
      setSearching(false)
      setFiltered(dataSource)
    }
  };
  
      
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
            placeholder="Поиск по словарю"
            platform={inputProps}
            placeholderTextColor="#888"
            containerStyle={{
              width: "75%",
              height: "78%",
              justifyContent: 'center',
              borderRadius: 5,
              marginLeft: "2%",
              
            }}
            onChangeText={onSearch}
             
          />
        </View>
      </View>
        
        {
          searching &&
          <SearchDropDown
            onPress={() => setSearching(false)}
            dataSource={filtered} />
        }
        
    </View>
  )
}
*/
