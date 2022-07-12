import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../Styles/Header';
import { useNavigation } from '@react-navigation/native';


export default function Header() {
  const navigation = useNavigation();
  return (
    <View style={styles.Rectangle}>
      <Pressable onPress={() => navigation.openDrawer()} style={{height: 47, width: 47}}>
        <MenuIcon />
      </Pressable>
    </View>
  )
}

function MenuIcon() {
  return (
    <View>
      <Text style={styles.lines}>≡</Text>
    </View>
  )
}



