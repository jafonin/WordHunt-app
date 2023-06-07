import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, ScrollView, Image, SafeAreaView} from 'react-native';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
import {darkStyles} from '../Styles/DarkTheme/CustomDrawer';
import {lightStyles} from '../Styles/LightTheme/CustomDrawer';

const CustomDrawer = ({darkMode, setDarkMode, ...props}) => {
  const navigation = useNavigation();
  const dbHistory = openDatabase({name: 'UserHistory.db', createFromLocation: 1});
  const [data, setData] = useState([]);
  const styles = darkMode ? darkStyles : lightStyles;
  useEffect(() => {
    // fetchData();
  });
  const fetchData = async () => {
    try {
      await dbHistory.transaction(async tx => {
        await tx.executeSql(
          'SELECT word, en_id, ru_id FROM History ORDER BY time DESC LIMIT 5',
          [],
          (tx, results) => {
            let temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setData(temp);
          },
        );
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
  const navigateOnPress = async (word, id) => {
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

  const drawerHistory = () =>
    data.map((item, index) => {
      return (
        <View key={`${index}`} style={styles.spacer}>
          <Pressable
            style={{flexDirection: 'row', flex: 1, height: 45, alignItems: 'center'}}
            android_ripple={styles.ripple}
            onPress={() => navigateOnPress(item.word, item.en_id ? item.en_id : item.ru_id)}>
            <Icon name="history" size={24} style={styles.icon} />
            <Text style={styles.text}>{item.word}</Text>
          </Pressable>
        </View>
      );
    });

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
            <Image source={require('../img/logo.png')} style={styles.image} />
          </View>
        </SafeAreaView>

        <DrawerContentScrollView {...props} contentContainerStyle={{paddingTop: 22}}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <View style={styles.separator}></View>
        <View style={{flex: 1}}>{drawerHistory()}</View>
      </ScrollView>
    </View>
  );
};

export default CustomDrawer;
