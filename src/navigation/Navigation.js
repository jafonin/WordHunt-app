import React, {useEffect} from 'react';
import {NavigationContainer, useRoute} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import History from '../Screens/History';
import Dictionary from '../Screens/Dictionary';
import Main from '../Screens/Main';
import ResultEn from '../Screens/ResultEn';
import ResultRu from '../Screens/ResultRu';
import Settings from '../Screens/Settings';
import CustomDrawer from '../Components/CustomDrawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Components/Header';

const Drawer = createDrawerNavigator();

export const Navigation = ({darkMode, setDarkMode, ...props}) => {
  // const [darkMode, setDarkMode] = useState(false);

  // useEffect(() => {
  //   async function getTheme() {
  //     try {
  //       const theme = await AsyncStorage.getItem('theme');
  //       if (theme !== null) {
  //         setDarkMode(JSON.parse(theme));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getTheme();
  // }, []);

  const drawerStyle = darkMode
    ? {backgroudColor: '#242424', TintColor: '#fff3d6'}
    : {backgroudColor: '#ffffef', TintColor: '#583627'};

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
          drawerStyle: {backgroundColor: drawerStyle.backgroudColor},
          drawerLabelStyle: {fontSize: 16, fontFamily: 'georgia'},
          drawerType: 'slide',
          swipeEdgeWidth: 60,
          headerShown: false,
          // header: () => <Header darkMode={darkMode} />,
          drawerActiveBackgroundColor: drawerStyle.backgroudColor,
          drawerActiveTintColor: drawerStyle.TintColor,
          drawerInactiveTintColor: drawerStyle.TintColor,
          keyboardDismissMode: 'on-drag',
        }}>
        <Drawer.Screen
          name="Main"
          component={MainScreen}
          options={{
            drawerLabel: 'Главная',

            drawerIcon: () => (
              <Icon
                name="home"
                size={24}
                style={{marginRight: -20, color: drawerStyle.TintColor}}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="History"
          component={HistoryScreen}
          options={{
            drawerLabel: 'Вся история',
            drawerIcon: () => (
              <Icon
                name="history"
                size={24}
                style={{marginRight: -20, color: drawerStyle.TintColor}}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Dictionary"
          component={DictionaryScreen}
          options={{
            drawerLabel: 'Мой словарь',
            drawerIcon: () => (
              <Icon
                name="bookmark"
                size={24}
                style={{marginRight: -20, color: drawerStyle.TintColor}}
              />
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
          options={{drawerItemStyle: {display: 'none'}, onOpen: () => console.log('opened')}}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            drawerLabel: 'Настройки',
            drawerIcon: () => (
              <Icon
                name="settings"
                size={24}
                style={{marginRight: -20, color: drawerStyle.TintColor}}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
