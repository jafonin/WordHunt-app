import React, {useEffect, useState} from 'react';
import {Navigation} from './src/navigation/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getTheme() {
      try {
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
    getTheme();
  }, []);
  if (loading) {
    return null;
  }
  return <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />;
}
