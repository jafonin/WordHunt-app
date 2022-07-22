import React, { Component, useState } from 'react';

import { View, Text, Pressable, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Headerstyles } from '../Styles/Header';
import { SearchBar } from "@rneui/themed";
import { Platform} from 'react-native';
import SearchDropDown from './SearchDropDown';
import { styles } from '../Styles/UserCollections';

const DATA = [
  {
    id: "1",
    title: "Data Structures",
  },
  {
    id: "2",
    title: "STL",
  },
  {
    id: "3",
    title: "C++",
  },
  {
    id: "4",
    title: "Java",
  },
  {
    id: "5",
    title: "Python",
  },
  {
    id: "6",
    title: "CP",
  },
  {
    id: "7",
    title: "ReactJs",
  },
  {
    id: "8",
    title: "NodeJs",
  },
  {
    id: "9",
    title: "MongoDb",
  },
  {
    id: "10",
    title: "ExpressJs",
  },
  {
    id: "11",
    title: "PHP",
  },
  {
    id: "12",
    title: "MySql",
  },
];


const Item = ({ title }) => {
  return (
    <View style={Headerstyles.searchResultItem}>
      <Text style={{color: '#000', fontSize: 16}}>{title}</Text>
    </View>
  );
};

const renderItem = ({ item }) => <Item title={item.title} />;

class Search extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: DATA,
      error: null,
      searchValue: "",
      searching: false
    };
    this.arrayholder = DATA;  
  }
  
  searchFunction = (text) => {
    if (text) {
      this.setState({searching: true})
    }
    else {
      this.setState({searching: false})
    }

    const updatedData = this.arrayholder.filter((item) => {
      const item_data = `${item.title.toUpperCase()})`;
      const text_data = text.toUpperCase();
      return item_data.indexOf(text_data) > -1;
    });
    this.setState({ data: updatedData, searchValue: text });
  };
  
  render() {
    const { navigation } = this.props;
    const {inputProps} = this.props;
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
            value={this.state.searchValue}
            onChangeText={(text) => this.searchFunction(text)}          
          />                  
        </View>        
      </View>
      {this.state.searching &&
        <FlatList
              data={this.state.data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{height: '100%', marginTop: 20}}
          />
        }
    </View>
    );
  }
}

export default function(props) {
  const navigation = useNavigation();
  const inputProps = Platform.select({
    android: "android",
    ios: "ios",
  });
  return <Search {...props} navigation={navigation} inputProps={inputProps}/>;
}

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
