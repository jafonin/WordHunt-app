import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import History from '../Screens/History';
import Dictionary from '../Screens/Dictionary';
import Main from '../Screens/Main';
import ResultEn from '../Screens/ResultEn';
import ResultRu from '../Screens/ResultRu';

const Drawer = createDrawerNavigator();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        backBehavior="history"
        initialRouteName="Main"
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
        <Drawer.Screen name="Main" component={Main} options={{drawerLabel: 'Главная'}} />
        <Drawer.Screen name="History" component={History} options={{drawerLabel: 'Вся история'}} />
        <Drawer.Screen
          name="Dictionary"
          component={Dictionary}
          options={{drawerLabel: 'Мой словарь'}}
        />
        <Drawer.Screen
          name="ResultEn"
          component={ResultEn}
          options={{drawerItemStyle: {display: 'none'}}}
        />
        <Drawer.Screen
          name="ResultRu"
          component={ResultRu}
          options={{drawerItemStyle: {display: 'none'}}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
