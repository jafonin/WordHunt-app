import React from 'react';
import { View, Button } from 'react-native';
import { styles } from '../Styles/HeaderStyle';
import { useNavigation } from '@react-navigation/native';



export default function Header() {
  const navigation = useNavigation();
  return (
    <View style={styles.Rectangle}>
      <Button title=":" onPress={() => navigation.openDrawer()}/>
    </View>
  )
}


