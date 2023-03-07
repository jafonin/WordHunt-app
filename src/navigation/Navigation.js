import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import History from '../Screens/History';
import Dictionary from '../Screens/Dictionary';
import Main from '../Screens/Main';
import ResultEn from '../Screens/ResultEn';
import ResultRu from '../Screens/ResultRu';
import CustomDrawer from '../Components/CustomDrawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        backBehavior="history"
        initialRouteName="Main"
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          drawerStyle: {backgroundColor: '#ffffef'},
          drawerLabelStyle: {fontSize: 16, fontFamily: 'georgia'},
          drawerType: 'slide',
          swipeEdgeWidth: 60,
          headerShown: false,
          drawerActiveBackgroundColor: '#ffffef',
          drawerActiveTintColor: '#583627',
          drawerInactiveTintColor: '#583627',
        }}>
        <Drawer.Screen
          name="Main"
          component={Main}
          options={{
            drawerLabel: 'Главная',
            drawerIcon: () => (
              <Icon name="home" size={24} style={{marginRight: -20, color: '#583627'}} />
            ),
          }}
        />
        <Drawer.Screen
          name="History"
          component={History}
          options={{
            drawerLabel: 'Вся история',
            drawerIcon: () => (
              <Icon name="history" size={24} style={{marginRight: -20, color: '#583627'}} />
            ),
          }}
        />
        <Drawer.Screen
          name="Dictionary"
          component={Dictionary}
          options={{
            drawerLabel: 'Мой словарь',
            drawerIcon: () => (
              <Icon name="book" size={24} style={{marginRight: -20, color: '#583627'}} />
            ),
          }}
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
