import React from 'react';

import { View, Text, Pressable } from 'react-native';
import { Input, Button, Box, NativeBaseProvider} from "native-base";
import { useNavigation } from '@react-navigation/native';
import { styles } from '../Styles/Header';
import { SearchBar } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import { Platform} from 'react-native'

export default function Header() {
  const navigation = useNavigation();
  const [searchValue, setSearchValue] = React.useState('');

  const updateSearch = (searchValue) => {
    setSearchValue(searchValue);
  };
  const inputProps = Platform.select({
    android: "android",
    ios: "ios",
  });

  return (
    <View style={styles.rectangle}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        <Pressable
          onPress={() => navigation.openDrawer()}
          style={styles.button}>
          <Text style={styles.lines}>≡</Text>
        </Pressable>
        <SearchBar
          placeholder="Поиск по словарю"
          platform={inputProps}
          placeholderTextColor="#888"
          containerStyle={{
            width: "75%",
            height: "78%",
            justifyContent: 'center',
            borderRadius: 5,
            marginLeft: "2%",
            
          }}
          onChangeText={updateSearch}
          onPress={console.log(searchValue)}  
        />
      </View>
    </View>
  )
}

/*
function Search() {
  const [searchValue, setSearchValue] = React.useState('');
  const updateSearch = (searchValue) => {
    setSearchValue(searchValue);
  };
  return(
    <NativeBaseProvider>
      <Box>
        <Input w="92%" maxW="500px" py="1.5" borderWidth="0" backgroundColor="#fff" onChangeText={updateSearch} value={searchValue}
          InputRightElement={   
            <Button size="xs" rounded="none" w="1/5" h="full" onPress={console.log(searchValue)}>
                
              </Button>         
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center", height: "100%", marginLeft: 0}}>
              <Button size="md" rounded="none" w="1/5" h="full" padding="0" marginRight="0.5" backgroundColor="">
                <CloseIcon color="#040"/>
              </Button>
              <Button size="xs" rounded="none" w="1/3" h="full" padding="0" onPress={console.log(searchValue)}>
                <SearchIcon color="#fff"/>
              </Button>
              
            </View>
          }
           placeholder="Поиск по словарю"/>
      </Box>
    </NativeBaseProvider>
  )
}
*/


