import {Text, View, ScrollView} from 'react-native';
import React, {Component} from 'react';
import Header from '../Components/Header';
import {lightStyles} from '../Styles/LightTheme/Settings';
import {darkStyles} from '../Styles/DarkTheme/Settings';

class SettingsPage extends Component {
  render() {
    const ResultStyles = this.props.darkMode ? darkStyles : lightStyles;
    return (
      <View style={ResultStyles.body}>
        <Header darkMode={this.props.darkMode} />

        {/* <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          style={{flex: 1}}>
          <View style={[ResultStyles.spacer]}>
            <Text> </Text>
          </View>
        </ScrollView> */}
      </View>
    );
  }
}
export default function Settings({darkMode}) {
  return <SettingsPage darkMode={darkMode} />;
}
