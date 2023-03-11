import React from 'react';
import {View, Text} from 'react-native';
import {lightStyles} from '../Styles/LightTheme/MainScreen';
import {darkStyles} from '../Styles/DarkTheme/MainScreen';
import Header from '../Components/Header';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native';
import {StatusBar} from 'react-native';

function Main({darkMode}) {
  const styles = darkMode ? darkStyles : lightStyles;
  return (
    <SafeAreaView style={styles.body}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Header darkMode={darkMode} />
      <ScrollView style={styles.spacer}>
        <View>
          <Text style={styles.title}>Англо-русский и русско-английский словарь</Text>
        </View>
        <View>
          <Text style={styles.description}>125 000 статей англо-русского словаря</Text>
          <Text style={styles.description}>Английская и британская озвучка слов</Text>
          <Text style={styles.description}>Транскрипции</Text>
          <Text style={styles.description}>Частотность употребления слова</Text>
          <Text style={styles.description}>Около 5 000 000 примеров употребления слов</Text>
          <Text style={styles.description}>Фразовые глаголы и формы слов.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Main;
