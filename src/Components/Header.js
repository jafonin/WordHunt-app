import React from 'react';
import { View, Button, Pressable } from 'react-native';
import { styles } from '../Styles/Header';
import { useNavigation } from '@react-navigation/native';
import Icon  from 'react-native-vector-icons/SimpleLineIcons';
import MenuIcon from './Icons/MenuIcon';


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


