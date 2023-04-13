import {Text, View} from 'react-native';
import React, {Component} from 'react';
import Header from '../Components/Header';
import {lightStyles} from '../Styles/LightTheme/ResultScreen';
import {darkStyles} from '../Styles/DarkTheme/ResultScreen';

class SettingsPage extends Component {
  render() {
    const ResultStyles = this.props.darkMode ? darkStyles : lightStyles;
    return (
      <View style={ResultStyles.body}>
        <Header darkMode={this.props.darkMode} />
        <Text>Settings</Text>
      </View>
    );
  }
}
export default function Settings({darkMode}) {
  return <SettingsPage darkMode={darkMode} />;
}
