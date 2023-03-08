import React from 'react';
import {View, Text} from 'react-native';
import {lightStyles} from '../Styles/LightTheme/MainScreen';
import {darkStyles} from '../Styles/DarkTheme/MainScreen';
import Header from '../Components/Header';
import {ScrollView} from 'react-native';

function Main({darkMode}) {
  const mainStyles = darkMode ? darkStyles : lightStyles;
  return (
    <View style={mainStyles.body}>
      <Header darkMode={darkMode} />
      <ScrollView style={mainStyles.spacer}>
        <View>
          <Text style={mainStyles.title}>Англо-русский и русско-английский словарь</Text>
        </View>
        <View>
          <Text style={mainStyles.description}>125 000 статей англо-русского словаря</Text>
          <Text style={mainStyles.description}>Английская и британская озвучка слов</Text>
          <Text style={mainStyles.description}>Транскрипции</Text>
          <Text style={mainStyles.description}>Частотность употребления слова</Text>
          <Text style={mainStyles.description}>Около 5 000 000 примеров употребления слов</Text>
          <Text style={mainStyles.description}>Фразовые глаголы и формы слов.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default Main;
