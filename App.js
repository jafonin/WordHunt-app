import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Main from './src/Screens/Main';
import Header from './src/Components/Header';

function HomeScreen({ navigation }) {
  return (
    <View>
      <Header />
      <Main />
    </View>     
  );
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
            swipeEdgeWidth: 300,
            headerShown: false

          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

function App() {
  return (     
        <SideMenu />
  );
}

export default App;