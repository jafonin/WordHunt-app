import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {styles} from '../Styles/UserCollections';
import Header from '../Components/Header';
import DictionaryContent from '../Components/DictionaryContent';

export default function Dictionary({navigation}) {
  const onPressHandler = () => {
    navigation.jumpTo('History');
  };
  return (
    <View style={{flex: 1}}>
      <Header />
      <View style={styles.body}>
        <View style={styles.rectangle}>
          <Pressable style={styles.button} onPress={onPressHandler}>
            <Text style={styles.title}>История запросов</Text>
          </Pressable>
          <Pressable style={styles.thisButton}>
            <Text style={styles.title}>Мой словарь</Text>
          </Pressable>
        </View>
      </View>
      <DictionaryContent />
    </View>
  );
}
