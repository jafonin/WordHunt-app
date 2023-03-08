import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {SafeAreaView} from 'react-native';
import {Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          height: 160,
          backgroundColor: darkMode ? '#17344a' : '#1d415d',
          justifyContent: 'flex-end',
          marginBottom: -10,
          shadowColor: darkMode ? '#888' : '#000000',
          shadowOffset: {width: 0, height: 6},
          shadowOpacity: 0.5,
          shadowRadius: 6,
          elevation: 15,
        }}>
        <Pressable onPress={toggleDarkMode}>
          <Text style={{color: '#888', margin: 20}}>Сменить тему</Text>
        </Pressable>
        <Image
          source={require('../img/logo.png')}
          style={{width: 191, height: 24, marginBottom: 25, marginLeft: 15}}
        />
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

export default CustomDrawer;
