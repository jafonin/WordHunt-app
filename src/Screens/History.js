import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {lightStyles} from '../Styles/LightTheme/UserCollections';
import {darkStyles} from '../Styles/DarkTheme/UserCollections';
import HistoryContent from '../Components/HistoryContent';
import Header from '../Components/Header';
import {useNavigation} from '@react-navigation/native';

export default function History({darkMode}) {
  const navigation = useNavigation();
  const onPressHandler = () => {
    navigation.jumpTo('Dictionary');
  };
  const styles = darkMode ? darkStyles : lightStyles;
  return (
    <View style={styles.body}>
      <Header darkMode={darkMode} />
      <View style={styles.spacer}>
        <View style={styles.rectangle}>
          <Pressable
            style={[styles.button, {backgroundColor: '#ffdca9', borderRadius: 6}]}
            android_ripple={{color: '#dbbe93'}}>
            <Text style={styles.screenName}>История запросов</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={onPressHandler}
            android_ripple={{color: '#dbbe93'}}>
            <Text style={styles.screenName}>Мой словарь</Text>
          </Pressable>
        </View>
      </View>
      <HistoryContent darkMode={darkMode} />
    </View>
  );
}
