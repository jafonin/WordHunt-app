import React from 'react';

import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../Styles/Header';


export default function Header() {
  const navigation = useNavigation();
  return (
    <View style={styles.Rectangle}>
      <Pressable
        onPress={() => navigation.openDrawer()}
        style={styles.button}>
        <Text style={styles.lines}>≡</Text>
      </Pressable>
    </View>
  )
}


