import {View, Text, Pressable} from 'react-native';
import React from 'react';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {SafeAreaView} from 'react-native';
import {Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-vector-icons/MaterialIcons';

const CustomDrawer = ({darkMode, setDarkMode, ...props}) => {
  const toggleDarkMode = async () => {
    try {
      await AsyncStorage.setItem('theme', JSON.stringify(!darkMode));
      setDarkMode(!darkMode);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          height: '20%',
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
      <DrawerContentScrollView {...props} contentContainerStyle={{paddingTop: 22}}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* <Pressable>
        <Text style={{fontSize: 16, fontFamily: 'georgia', color: '#fff3d6', margin: 20}}>
          Настройки
        </Text>
      </Pressable> */}
    </SafeAreaView>
  );
};

export default CustomDrawer;
