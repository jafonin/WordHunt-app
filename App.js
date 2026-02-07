import React, {useEffect, useState} from 'react';
import {Navigation} from './src/navigation/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initUserDatabases } from './src/Services/Database';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeApp() {
      try {
        initUserDatabases();
        const theme = await AsyncStorage.getItem('theme');
        if (theme !== null) {
          setDarkMode(JSON.parse(theme));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    initializeApp();
  }, []);

  if (loading) {
    return null;
  }

  return <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />;
}