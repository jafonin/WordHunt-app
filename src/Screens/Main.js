import React, { Component, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { styles } from '../Styles/MainScreen';
import Search from '../Components/Header';




function Main() {
  return (
    <View>
      <Search/>
      
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
      {/*<View style={{height: 50, width: "90%", backgroundColor: "#fff", flexWrap: 'wrap', position: 'absolute',
        top: 59,
        left: 0, right: 0, bottom: 0, paddingTop: 10,
  marginHorizontal: 20,}}/>*/}
    </View>
  )
}

export default Main