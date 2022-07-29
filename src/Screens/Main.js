import React from 'react';
import { View, Text } from 'react-native';
import { Mainstyles } from '../Styles/MainScreen';

import Header from '../Components/Header';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WordPage from './WordPage';

const Stack = createNativeStackNavigator();

function Main() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        
      }}>
      <Stack.Screen name="MainText" component={MainText}/>
      <Stack.Screen name="WordPage" component={WordPage}/>
    </Stack.Navigator>
  )
}

function MainText() {
  return(
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
    
  )
}


export default Main