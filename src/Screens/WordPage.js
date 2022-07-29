import React from 'react'
import { Text, View } from 'react-native'
import Header from '../Components/Header';


function WordPage({route}) {
    const {title} = route.params.word
  return (
    <View>
        <Header />
        <Text style={{color: '#000'}}>
            {title}
        </Text>
    </View>
  )
}

export default WordPage