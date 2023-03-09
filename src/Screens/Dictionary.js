import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {lightStyles} from '../Styles/LightTheme/UserCollections';
import {darkStyles} from '../Styles/DarkTheme/UserCollections';
import Header from '../Components/Header';
import DictionaryContent from '../Components/DictionaryContent';
import {useNavigation} from '@react-navigation/native';

export default function Dictionary({darkMode}) {
  const navigation = useNavigation();
  const onPressHandler = () => {
    navigation.jumpTo('History');
  };
  const styles = darkMode ? darkStyles : lightStyles;
  return (
    <View style={styles.body}>
      <Header darkMode={darkMode} />
      <View style={styles.spacer}>
        <View style={styles.rectangle}>
          <Pressable
            style={styles.button}
            onPress={onPressHandler}
            android_ripple={{color: '#dbbe93'}}>
            <Text style={styles.screenName}>История запросов</Text>
          </Pressable>
          <Pressable
            style={[styles.button, {backgroundColor: '#ffdca9', borderRadius: 6}]}
            android_ripple={{color: '#dbbe93'}}>
            <Text style={styles.screenName}>Мой словарь</Text>
          </Pressable>
        </View>
      </View>
      <DictionaryContent darkMode={darkMode} />
    </View>
  );
}
