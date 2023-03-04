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
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header />
      <View style={styles.body}>
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
      <DictionaryContent />
    </View>
  );
}
