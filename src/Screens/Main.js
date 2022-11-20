import React from 'react';
import {View, Text} from 'react-native';
import {Mainstyles} from '../Styles/MainScreen';

import Header from '../Components/Header';

function Main() {
  return (
    <View>
      <Header />
      <View style={Mainstyles.body}>
        <View>
          <Text style={Mainstyles.MainTitle}>Англо-русский и русско-английский словарь</Text>
        </View>
        <View>
          <Text style={Mainstyles.MainDescription}>125 000 статей англо-русского словаря</Text>
          <Text style={Mainstyles.MainDescription}>Английская и британская озвучка слов</Text>
          <Text style={Mainstyles.MainDescription}>Транскрипции</Text>
          <Text style={Mainstyles.MainDescription}>Частотность употребления слова</Text>
          <Text style={Mainstyles.MainDescription}>Около 5 000 000 примеров употребления слов</Text>
          <Text style={Mainstyles.MainDescription}>Фразовые глаголы и формы слов.</Text>
        </View>
      </View>
    </View>
  );
}

export default Main;
