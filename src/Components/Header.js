import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Keyboard,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {lightStyles} from '../Styles/LightTheme/Header';
import {darkStyles} from '../Styles/DarkTheme/Header';
import {openDatabase} from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const db = openDatabase({name: 'ru_en_word.db', createFromLocation: 1});

class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchValue: '',
      searching: false,
      updateItem: false,
      goTo: '',
    };
  }

  handleSearch(text) {
    if (text) {
      this.setState({searching: true});
    } else {
      this.setState({searching: false, data: []});
    }
    this.setState({searchValue: text});
    this.fetchData(text);
  }

  fetchData = async searchValue => {
    if (searchValue) {
      if (/[A-Za-z]/.test(searchValue)) {
        var query =
          'SELECT id, word, t_inline, transcription_us, transcription_uk ' +
          "FROM en_ru_word WHERE t_mix IS NOT NULL AND t_inline IS NOT NULL AND word LIKE '" +
          searchValue.toLowerCase() +
          "%' ORDER BY rank LIMIT 10";
        // var db = dbEn;
        this.setState({goTo: 'ResultEn'});
      } else {
        var query =
          "SELECT id, word, t_inline, lemma FROM ru_en_word WHERE t_inline IS NOT '' AND word LIKE '" +
          searchValue.toLowerCase() +
          "%' ORDER BY rank LIMIT 10";
        // var db = dbRu;
        this.setState({goTo: 'ResultRu'});
      }
      try {
        await db.transaction(async tx => {
          await tx.executeSql(query, [], (tx, results) => {
            let temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            this.setState({data: temp});
          }),
            function (tx, err) {
              alert('not found'); // НЕ РАБОТАЕТ
            };
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  navigateOnPress = (id, word) => {
    const {navigation} = this.props;
    return (
      navigation.jumpTo(this.state.goTo, {word: word, id: id}),
      this.setState({searching: false, searchValue: null, data: []}),
      Keyboard.dismiss()
    );
  };

  renderItem = ({item}) => {
    const {word} = item;
    const {id} = item;
    const {t_inline} = item;
    const {transcription_us} = item;
    const {transcription_uk} = item;
    const Headerstyles = this.props.darkMode ? darkStyles : lightStyles;
    if (t_inline) {
      return (
        <View key={id}>
          <Pressable
            style={Headerstyles.itemButton}
            onPress={() => this.navigateOnPress(id, word)}
            android_ripple={{color: '#888'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginLeft: 15,
                marginRight: 55,
              }}>
              <Icon name="search" size={24} style={Headerstyles.icon} />
              <Text style={Headerstyles.itemText} numberOfLines={2}>
                <Text style={{fontWeight: '900', color: Headerstyles.input.color}}>{word}</Text>
                {' — '}
                {t_inline}
              </Text>
            </View>
          </Pressable>
        </View>
      );
    } else null;
  };

  render() {
    const Headerstyles = this.props.darkMode ? darkStyles : lightStyles;
    const {navigation} = this.props;
    const {inputProps} = this.props;
    return (
      <SafeAreaView>
        <View>
          <StatusBar translucent backgroundColor="transparent" />
          <View style={Headerstyles.rectangle}>
            <View style={Headerstyles.spacer}>
              <View style={Headerstyles.drawerButton}>
                <Pressable
                  onPress={() => navigation.openDrawer()}
                  style={{marginHorizontal: 8}}
                  android_ripple={{color: '#888', borderless: true, radius: 20}}>
                  <Text style={Headerstyles.threeLines}>≡</Text>
                </Pressable>
              </View>
              <TextInput
                placeholder="Поиск по словарю"
                placeholderTextColor="#888"
                style={Headerstyles.input}
                value={this.state.searchValue}
                onChangeText={text => this.handleSearch(text)}
              />
            </View>
          </View>
          {this.state.searching && (
            <FlatList
              data={this.state.data}
              keyExtractor={item => item.id}
              windowSize={1}
              renderItem={this.renderItem}
              style={{height: '100%', paddingVertical: 20, width: '100%'}}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default function Header({darkMode, ...props}) {
  const navigation = useNavigation();
  const inputProps = Platform.select({
    android: 'android',
    ios: 'ios',
  });
  console.log(darkMode);
  return <Search {...props} navigation={navigation} inputProps={inputProps} darkMode={darkMode} />;
}
