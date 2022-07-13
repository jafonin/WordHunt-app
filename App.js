import * as React from 'react';

import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Main from './src/Screens/Main';

function HomeScreen() {
  return (
    <View>
      <Main />
    </View>     
  )
}

const Drawer = createDrawerNavigator();

function SideMenu(){
  return(
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Главная" component={HomeScreen}
          options={{
            drawerStyle: {
              backgroundColor: '#ffffef',
            },
            drawerType: 'slide',
            gestureEnabled: 'true',
            swipeEdgeWidth: 450,
            headerShown: false,
            drawerActiveBackgroundColor: '#ffefbe',
            drawerActiveTintColor: '#583627'

          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SideMenu />
  );
}