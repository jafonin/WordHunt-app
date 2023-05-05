import React, {Component} from 'react';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
import {Text, View, Image, Pressable, ScrollView, Keyboard} from 'react-native';
import StyledText from 'react-native-styled-text';
import {setData} from '../Components/AddToHistory';
import Header from '../Components/Header';
import {lightStyles} from '../Styles/LightTheme/ResultScreen';
import {darkStyles} from '../Styles/DarkTheme/ResultScreen';

const db = openDatabase({name: 'ru_en_word.db', createFromLocation: 1});
const dbDic = openDatabase({name: 'UserDictionary.db', createFromLocation: 1});

class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {data: [], inDictionary: false};
  }

  componentDidMount() {
    this.setState({data: []});
    this.fetchData(this.props.id, this.props.word);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.word !== this.props.word || prevProps.isFocused !== this.props.isFocused) {
      this.setState({data: [], inDictionary: false});
      this.fetchData(this.props.id, this.props.word);
    }
  }

  fetchData = async (id, word) => {
    await db.transaction(async tx => {
      await tx.executeSql(
        "SELECT * FROM en_ru_word WHERE word = '" + word + "'",
        [],
        (tx, results) => {
          var temp = [];
          temp.push(results.rows.item(0));
          this.setState({data: temp});
          setData(word, id, temp[0].t_inline, temp[0].transcription_us);
        },
      );
    });
    await dbDic.transaction(async tx => {
      await tx.executeSql(
        "SELECT * FROM dictionary WHERE word = '" + word + "'",
        [],
        (tx, results) => {
          var dictionaryTemp = [];
          dictionaryTemp.push(results.rows.item(0));
          dictionaryTemp[0].word.length > 0 && this.setState({inDictionary: true});
        },
      );
    });
  };
  //ДОБАВИТЬ ТАЙМШТАМП
  onButtonPress(t_inline, transcription_us, transcription_uk) {
    const {word} = this.props;
    if (!this.state.inDictionary) {
      dbDic.transaction(tx => {
        tx.executeSql(
          'INSERT OR IGNORE INTO dictionary (word, t_inline, transcription_us, transcription_uk) VALUES (?,?,?,?)',
          [word, t_inline, transcription_us, transcription_uk],
        );
      });
    } else {
      dbDic.transaction(tx => {
        tx.executeSql("DELETE FROM dictionary WHERE word = '" + word + "'", []);
      });
    }
    this.setState({inDictionary: !this.state.inDictionary});
  }

  renderDescription(word, styles) {
    return Object.values(word).map((translation, index) => {
      return (
        <View key={index} style={{marginVertical: 15}}>
          <StyledText style={styles.translationItalic}>{translation.w}</StyledText>
          <StyledText style={styles.translation}>{'- ' + translation.t.join('\n\n- ')}</StyledText>
        </View>
      );
    });
  }
  // ПЕРЕМЕСТИТЬ В RENDER(){  }
  description(item) {
    const styles = this.props.darkMode ? darkStyles : lightStyles;
    return Object.values(JSON.parse(item.t_mix)).map((word, index) => {
      return <View key={index}>{this.renderDescription(word, styles)}</View>;
    });
  }

  transcriptions(item) {
    const styles = this.props.darkMode ? darkStyles : lightStyles;
    return (
      <View style={styles.transcriptions}>
        <View>
          {item.transcription_us !== null ? (
            <Text>
              <Text style={[styles.transcriptionWord, {fontStyle: 'italic'}]}>амер. </Text>
              <Text style={[styles.transcriptionWord, {marginLeft: 7}]}>
                |{item.transcription_us}|
              </Text>
            </Text>
          ) : null}
          {item.transcription_uk !== null ? (
            <Text>
              <Text style={[styles.transcriptionWord, {fontStyle: 'italic'}]}>брит. </Text>
              <Text style={[styles.transcriptionWord, {marginLeft: 7}]}>
                |{item.transcription_uk}|
              </Text>
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  render() {
    const styles = this.props.darkMode ? darkStyles : lightStyles;
    const imageSource = this.state.inDictionary
      ? require('../img/pd_11.png')
      : require('../img/pd_00.png');
    const page = this.state.data.map(item => (
      <View key={item.id} style={styles.spacer}>
        <View style={styles.title}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={styles.titleWord}>
              {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
            </Text>
            <Text style={styles.rank}>{item.rank}</Text>
          </View>
          <Pressable
            onPress={() =>
              this.onButtonPress(item.t_inline, item.transcription_us, item.transcription_uk)
            }
            android_ripple={styles.ripple}
            style={styles.flagButton}>
            <Image source={imageSource} style={styles.image} />
          </Pressable>
        </View>
        {item.transcription_us !== null || item.transcription_uk !== null
          ? this.transcriptions(item)
          : null}
        <View style={{marginVertical: 10}}>
          <Text style={styles.translation}>{item.t_inline}</Text>
        </View>
        <View>{this.description(item)}</View>
      </View>
    ));
    return (
      <View style={styles.body}>
        <Header darkMode={this.props.darkMode} />
        <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
          {page}
        </ScrollView>
      </View>
    );
  }
}

export default function ResultEn({darkMode, ...props}) {
  const route = useRoute();
  const {word} = route.params;
  const {id} = route.params;
  const isFocused = useIsFocused();
  return <ResultPage {...props} word={word} id={id} darkMode={darkMode} isFocused={isFocused} />;
}
