import React, {PureComponent} from 'react';
import {View, Text, Pressable, FlatList, Keyboard, TextInput, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {lightStyles} from '../Styles/LightTheme/Header';
import {darkStyles} from '../Styles/DarkTheme/Header';
import {openDatabase} from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {FadeIn, FadeOut, SlideOutDown, ZoomOut} from 'react-native-reanimated';

const db = openDatabase({name: 'wordhunt_temp.db', createFromLocation: 1});

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
    this.fetchData(text.trim());
  }

  fetchData = async searchValue => {
    if (searchValue) {
      if (/[A-Za-z]/.test(searchValue)) {
        var query =
          'SELECT id, word, t_inline, transcription_us, transcription_uk ' +
          "FROM en_ru_word WHERE t_inline IS NOT NULL AND word LIKE '" +
          searchValue.toLowerCase() +
          "%' ORDER BY rank LIMIT 10";
        this.setState({goTo: 'ResultEn'});
      } else {
        var query =
          "SELECT id, word, t_inline, lemma FROM ru_en_word WHERE t_inline IS NOT '' AND word LIKE '" +
          searchValue.toLowerCase() +
          "%' ORDER BY id LIMIT 10";
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
              alert('not found');
            };
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  navigateOnPress = (id, word) => {
    const {navigation} = this.props;
    const {goTo} = this.state;
    return this.setState({searching: false, searchValue: null, data: []}, () =>
      navigation.jumpTo(goTo, {word: word, id: id}),
    );
  };

  clearSearchField = () => {
    return this.setState({searchValue: null, searching: false, data: []});
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
            onPress={() => {
              Keyboard.dismiss();
              this.navigateOnPress(id, word);
            }}
            android_ripple={Headerstyles.ripple}>
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

  keyExtractor = item => item.id.toString();

  render() {
    const Headerstyles = this.props.darkMode ? darkStyles : lightStyles;
    const {navigation} = this.props;
    const {inputProps} = this.props;
    return (
      <View>
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
            <View style={Headerstyles.inputBackgroud}>
              <TextInput
                placeholder="Поиск по словарю"
                placeholderTextColor="#888"
                returnKeyType="search"
                style={Headerstyles.input}
                value={this.state.searchValue}
                onChangeText={text => this.handleSearch(text)}
                // onKeyPress={() => console.log(this.state.searchValue)}
              />
              <Pressable
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.clearSearchField()}>
                <Icon
                  name={this.state.searching ? 'clear' : 'search'}
                  size={24}
                  style={Headerstyles.clearButton}
                />
              </Pressable>
            </View>
          </View>
        </View>
        {this.state.searching ? (
          <Animated.FlatList
            entering={FadeIn}
            data={this.state.data}
            keyExtractor={this.keyExtractor}
            windowSize={1}
            renderItem={this.renderItem}
            style={{height: '100%', paddingVertical: 20, width: '100%'}}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        ) : null}
      </View>
    );
  }
}

export default function Header({darkMode, ...props}) {
  const navigation = useNavigation();
  const inputProps = Platform.select({
    android: 'android',
    ios: 'ios',
  });
  return <Search {...props} navigation={navigation} inputProps={inputProps} darkMode={darkMode} />;
}
