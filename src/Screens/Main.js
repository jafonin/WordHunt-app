import React, { Component, useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { styles } from '../Styles/MainScreen';
import { Headerstyles } from '../Styles/Header';
import { SearchBar } from "@rneui/themed";
import { Platform} from 'react-native';
import SearchDropDown from '../Components/SearchDropDown';


function Main() {
  return (
    <View>
      <View style={styles.body}>
        <View>
          <Text style={styles.MainTitle}>Англо-русский и русско-английский словарь</Text>
        </View>
        <View>
          <Text style={styles.MainDescription}>125 000 статей англо-русского словаря</Text>
          <Text style={styles.MainDescription}>Английская и британская озвучка слов</Text>
          <Text style={styles.MainDescription}>Транскрипции</Text>
          <Text style={styles.MainDescription}>Частотность употребления слова</Text>
          <Text style={styles.MainDescription}>Около 5 000 000 примеров употребления слов</Text>
          <Text style={styles.MainDescription}>Фразовые глаголы и формы слов.</Text>
        </View>
      </View>
    </View>
  )
}

export default Main