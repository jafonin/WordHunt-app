import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import History from '../Screens/History';
import Dictionary from '../Screens/Dictionary';
import Main from '../Screens/Main';
import ResultEn from '../Screens/ResultEn';
import ResultRu from '../Screens/ResultRu';
import Settings from '../Screens/Settings';
import CustomDrawer from '../Components/CustomDrawer';

const Drawer = createDrawerNavigator();

export const Navigation = ({ darkMode, setDarkMode }) => {

  const drawerStyle = darkMode
    ? {backgroundColor: '#242424', tintColor: '#fff3d6'}
    : {backgroundColor: '#ffffef', tintColor: '#583627'};

  const MainScreen = () => <Main darkMode={darkMode} />;
  const HistoryScreen = () => <History darkMode={darkMode} />;
  const DictionaryScreen = () => <Dictionary darkMode={darkMode} />;
  const ResultEnScreen = () => <ResultEn darkMode={darkMode} />;
  const ResultRuScreen = () => <ResultRu darkMode={darkMode} />;
  const SettingsScreen = () => <Settings darkMode={darkMode} />;

  return (
    <NavigationContainer>
      <Drawer.Navigator
        backBehavior="history"
        initialRouteName="Main"
        drawerContent={props => (
          <CustomDrawer {...props} darkMode={darkMode} setDarkMode={setDarkMode} />
        )}
        screenOptions={{
          drawerStyle: {backgroundColor: drawerStyle.backgroundColor},
          drawerLabelStyle: {fontSize: 16, fontFamily: 'georgia'},
          drawerType: 'slide',
          swipeEdgeWidth: 60,
          headerShown: false,
          drawerActiveBackgroundColor: drawerStyle.backgroundColor,
          drawerActiveTintColor: drawerStyle.tintColor,
          drawerInactiveTintColor: drawerStyle.tintColor,
          keyboardDismissMode: 'on-drag',
        }}>
        <Drawer.Screen
          name="Main"
          component={MainScreen}
          options={{
            drawerLabel: 'Главная',
            drawerIcon: () => (
              <Icon name="home" size={24} style={{marginRight: -10, color: drawerStyle.tintColor}} />
            ),
          }}
        />
        <Drawer.Screen
          name="History"
          component={HistoryScreen}
          options={{
            drawerLabel: 'Вся история',
            drawerIcon: () => (
              <Icon name="history" size={24} style={{marginRight: -10, color: drawerStyle.tintColor}} />
            ),
          }}
        />
        <Drawer.Screen
          name="Dictionary"
          component={DictionaryScreen}
          options={{
            drawerLabel: 'Мой словарь',
            drawerIcon: () => (
              <Icon name="bookmark" size={24} style={{marginRight: -10, color: drawerStyle.tintColor}} />
            ),
          }}
        />
        <Drawer.Screen
          name="ResultEn"
          component={ResultEnScreen}
          options={{drawerItemStyle: {display: 'none'}}}
        />
        <Drawer.Screen
          name="ResultRu"
          component={ResultRuScreen}
          options={{drawerItemStyle: {display: 'none'}}}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            drawerLabel: 'Настройки',
            drawerIcon: () => (
              <Icon name="settings" size={24} style={{marginRight: -10, color: drawerStyle.tintColor}} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};