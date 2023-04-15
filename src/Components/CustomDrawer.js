import {View, Text, Pressable, ScrollView} from 'react-native';
import React from 'react';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {SafeAreaView} from 'react-native';
import {Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HistoryContent from './HistoryContent';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import {useEffect} from 'react';

const CustomDrawer = ({darkMode, setDarkMode, ...props}) => {
  const navigation = useNavigation();
  const dbHistory = openDatabase({name: 'UserHistory.db', createFromLocation: 1});
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  });
  const fetchData = () => {
    let query = 'SELECT word, en_id, ru_id FROM History ORDER BY time DESC LIMIT 5';
    try {
      dbHistory.transaction(tx => {
        tx.executeSql(query, [], (tx, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setData(temp);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      await AsyncStorage.setItem('theme', JSON.stringify(!darkMode));
      setDarkMode(!darkMode);
    } catch (error) {
      console.log(error);
    }
  };
  const navigateOnPress = (word, id) => {
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
    return navigation.navigate(/[A-Za-z]/.test(word) ? 'ResultEn' : 'ResultRu', {
      word: word,
      id: id,
    });
    // this.setState({data: []})
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{height: 150}}>
          <View
            style={{
              flex: 1,

              backgroundColor: darkMode ? '#17344a' : '#1d415d',
              justifyContent: 'flex-end',
            }}>
            <Pressable onPress={toggleDarkMode}>
              <Text style={{color: '#888', margin: 20}}>Сменить тему</Text>
            </Pressable>
            <Image
              source={require('../img/logo.png')}
              style={{width: 191, height: 24, marginBottom: 25, marginLeft: 15}}
            />
          </View>
        </SafeAreaView>

        <DrawerContentScrollView {...props} contentContainerStyle={{paddingTop: 22}}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>

        {data.map((item, index) => {
          return (
            <View
              key={`${index}`}
              style={{paddingVertical: 10, flexDirection: 'row', marginHorizontal: 17, flex: 1}}>
              <Pressable
                style={{flexDirection: 'row', flex: 1}}
                onPress={() => navigateOnPress(item.word, item.en_id ? item.en_id : item.ru_id)}>
                <Icon name="history" size={26} />
                <Text style={{fontSize: 17, fontFamily: 'georgia', flex: 1, marginLeft: 12}}>
                  {item.word}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      {/* <Pressable>
        <Text style={{fontSize: 16, fontFamily: 'georgia', color: '#fff3d6', margin: 20}}>
          Настройки
        </Text>
      </Pressable> */}
    </View>
  );
};

export default CustomDrawer;
