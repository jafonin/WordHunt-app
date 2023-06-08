import {useRoute} from '@react-navigation/native';
import React from 'react';
import {useEffect, useState} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import SearchInDatabase from '../Components/SearchInDatabase';
import {darkStyles} from '../Styles/DarkTheme/Header';
import {lightStyles} from '../Styles/LightTheme/Header';
import {openDatabase} from 'react-native-sqlite-storage';

export default function Search() {
  const route = useRoute();
  //   const {data} = route.params;
  const {darkMode} = route.params;
  const {searchValue} = route.params;
  const [goTo, setGoTo] = useState('');
  const [data, setData] = useState([]);
  const db = openDatabase({name: 'wordhunt_temp.db', createFromLocation: 1});

  useEffect(() => {
    SearchInDatabase(searchValue.trim());
  });
  const SearchInDatabase = async searchValue => {
    if (searchValue) {
      if (/[A-Za-z]/.test(searchValue)) {
        var query =
          'SELECT id, word, t_inline, transcription_us, transcription_uk ' +
          "FROM en_ru_word WHERE t_inline IS NOT NULL AND word LIKE '" +
          searchValue.toLowerCase() +
          "%' ORDER BY rank LIMIT 10";
        setGoTo('ResultEn');
        // this.setState({goTo: 'ResultEn'});
      } else {
        var query =
          "SELECT id, word, t_inline, lemma FROM ru_en_word WHERE t_inline IS NOT '' AND word LIKE '" +
          searchValue.toLowerCase() +
          "%' ORDER BY id LIMIT 10";
        setGoTo('ResultRu');
        // this.setState({goTo: 'ResultRu'});
      }
      try {
        await db.transaction(async tx => {
          await tx.executeSql(query, [], (tx, results) => {
            let temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setData(temp);
            // this.setState({data: temp});
          }),
            function (tx, err) {
              alert('not found');
            };
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const keyExtractor = item => item.id.toString();
  const renderItem = ({item}) => {
    const {word} = item;
    const {id} = item;
    const {t_inline} = item;
    const {transcription_us} = item;
    const {transcription_uk} = item;
    const Headerstyles = darkMode ? darkStyles : lightStyles;
    if (t_inline) {
      return (
        <View key={id}>
          <Pressable
            style={Headerstyles.itemButton}
            onPress={() => {
              Keyboard.dismiss();
              this.navigateOnPress(id, word);
            }}
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
    } else null;
  };
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        windowSize={1}
        renderItem={renderItem}
        style={{height: '100%', paddingVertical: 20, width: '100%'}}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}
