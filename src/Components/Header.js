import React, {useState} from 'react';
import {View, Text, Pressable, Keyboard, TextInput, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {FadeIn} from 'react-native-reanimated';

import {lightStyles} from '../Styles/LightTheme/Header';
import {darkStyles} from '../Styles/DarkTheme/Header';

import {searchWordsInDb} from '../Services/Database';


const Header = ({ darkMode }) => {
  const navigation = useNavigation();
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState(false);

  const Headerstyles = darkMode ? darkStyles : lightStyles;

  const handleSearch = async (text) => {
    setSearchValue(text);
    if (text && text.trim().length > 0) {
      setSearching(true);
      try {
        const results = await searchWordsInDb(text.trim());
        setData(results);
      } catch (error) {
        console.error("Search error:", error);
        setData([]);
      }
    } else {
      setSearching(false);
      setData([]);
    }
  }

  const clearSearchField = () => {
    setSearchValue('');
    setSearching(false);
    setData([]);
    Keyboard.dismiss();           // Dismiss keyboard when clearing??????????????
  }

const onResultPress = (item) => {
  const {word, id} = item;
  const isEnglish = /[A-Za-z]/.test(word);
  const targetScreen = isEnglish ? 'ResultEn' : 'ResultRu';

  setSearchValue('');
  setSearching(false);
  setData([]);
  Keyboard.dismiss();

  navigation.jumpTo(targetScreen, {word: word, id: id});
}

const renderItem = ({item}) => {
  const {word, t_inline} = item;
  if (!t_inline) return null;
  
  return (<View key={item.id}>
      <Pressable
        style={Headerstyles.itemButton}
        onPress={() => onResultPress(item)}
        android_ripple={Headerstyles.ripple}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginLeft: 15,
            marginRight: 55,
          }}>
          <Icon name="search" size={24} style={Headerstyles.icon} />
          <Text style={Headerstyles.itemText} numberOfLines={2}>
            <Text style={{fontWeight: '900', color: Headerstyles.input.color}}>{word}</Text>
            {' — '}
            {t_inline}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
  
  return (
    <View>
      <View style={Headerstyles.rectangle}>
        <View style={Headerstyles.spacer}>
          <View style={Headerstyles.drawerButton}>
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={{marginHorizontal: 8}}
              android_ripple={{color: '#888', borderless: true, radius: 20}}>
              <Text style={Headerstyles.threeLines}>≡</Text>
            </Pressable>
          </View>
          <View style={Headerstyles.inputBackgroud}>
            <TextInput
              placeholder="Поиск по словарю"
              placeholderTextColor="#888"
              returnKeyType="search"
              style={Headerstyles.input}
              value={searchValue}
              onChangeText={handleSearch}
              // onKeyPress={() => console.log(searchValue)}
            />
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={clearSearchField}>
              <Icon
                name={searching ? 'clear' : 'search'}
                size={24}
                style={Headerstyles.clearButton}
              />
            </Pressable>
          </View>
        </View>
      </View>
      {searching && (
        <Animated.FlatList
          entering={FadeIn}
          data={data}
          keyExtractor={item => item.id.toString()}
          windowSize={1}
          renderItem={renderItem}
          style={{height: '100%', paddingVertical: 20, width: '100%'}}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}
    </View>
  )
};

export default Header;
