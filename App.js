import React from 'react';

import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';


import History from './src/Screens/History';
import UserDictionary from './src/Screens/UserDictionary';
import Main from './src/Screens/Main';
import Result from './src/Screens/Result';


const Drawer = createDrawerNavigator();

function SideMenu(){
  return(
    <NavigationContainer>
      <Drawer.Navigator
        backBehavior='history'
        screenOptions={{
            drawerStyle: {
              backgroundColor: '#ffffef',
            },
            drawerType: 'slide',
            gestureEnabled: 'true',
            swipeEdgeWidth: 450,
            headerShown: false,
            drawerActiveBackgroundColor: '#ffffef',
            drawerActiveTintColor: '#583627',
            drawerInactiveTintColor: '#583627',            
        }}>
        <Drawer.Screen name='Main' component={Main} options={{ drawerLabel: 'Главная'}} />
        <Drawer.Screen name='History' component={History} options={{ drawerLabel: 'Вся история' }}/>
        <Drawer.Screen name='UserDictionary' component={UserDictionary} options={{ drawerLabel: 'Мой словарь' }}/>
        <Drawer.Screen name='Result' component={Result} options={{ drawerItemStyle: { display: 'none' }}} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SideMenu />
  );
}