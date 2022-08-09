import React from 'react'
import { Text, View } from 'react-native'
import Header from '../Components/Header';
import { ResultStyles } from '../Styles/ResultScreen';


function Result({route}) {
  const {word} = route.params._word
  return (
    <View>
        <Header />
        <View style={ResultStyles.wd}>
          <View style={ResultStyles.wd_title}>
            <Text style={{color: '#213646', fontSize: 20, fontFamily: 'Open Sans'}}>
                {word.charAt(0).toUpperCase() + word.slice(1)}
            </Text>
          </View>
          
        </View>
        
    </View>
  )
}

export default Result