import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'

export default function MenuIcon() {
  return (
    <View>
      <Text style={styles.line}>≡</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    line: {  
        textAlign: 'center',
        fontSize: 35,
        color: 'white'
    }
})