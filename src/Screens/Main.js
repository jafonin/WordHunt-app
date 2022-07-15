import React from 'react';
import { View, Text } from 'react-native';
import Header from '../Components/Header';
import { styles } from '../Styles/MainScreen';


function Main() {
  return (
    <View>
      <Header />
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