import React, {Component} from 'react';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
import {Text, View, Image, Pressable, ScrollView} from 'react-native';
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
    this.setState({data: [], inDictionary: false});
    this.fetchData(this.props._id, this.props._word);
  }

  componentDidUpdate(prevProps) {
    if (prevProps._word !== this.props._word || prevProps.isFocused !== this.props.isFocused) {
      this.setState({data: [], inDictionary: false});
      this.fetchData(this.props._id, this.props._word);
    }
  }

  fetchData = async (_id, _word) => {
    await db.transaction(async tx => {
      await tx.executeSql(
        "SELECT * FROM en_ru_word WHERE word = '" + _word + "'",
        [],
        (tx, results) => {
          var temp = [];
          temp.push(results.rows.item(0));
          this.setState({data: temp});
          setData(_word, temp[0].t_inline, _id, temp[0].transcription_us);
        },
      );
    });
    dbDic.transaction(tx => {
      tx.executeSql("SELECT * FROM dictionary WHERE word = '" + _word + "'", [], (tx, results) => {
        var dictionaryTemp = [];
        dictionaryTemp.push(results.rows.item(0));
        dictionaryTemp[0].word.length > 0 && this.setState({inDictionary: true});
      });
    });
  };

  onButtonPress(t_inline, transcription_us, transcription_uk) {
    const {_word} = this.props;
    // var toggle = !this.state.inDictionary;
    this.setState({inDictionary: !this.state.inDictionary});
    if (!this.state.inDictionary) {
      dbDic.transaction(tx => {
        tx.executeSql(
          'INSERT OR IGNORE INTO dictionary (word, t_inline, transcription_us, transcription_uk) VALUES (?,?,?,?)',
          [_word, t_inline, transcription_us, transcription_uk],
        );
      });
    } else {
      dbDic.transaction(tx => {
        tx.executeSql("DELETE FROM dictionary WHERE word = '" + _word + "'", []);
      });
    }
  }

  renderDescription(word, ResultStyles) {
    return Object.values(word).map((translation, index) => {
      return (
        <View key={index} style={{marginVertical: 15}}>
          <StyledText style={ResultStyles.translationItalic}>{translation.w}</StyledText>
          <StyledText style={ResultStyles.translation}>
            {'- ' + translation.t.join('\n\n- ')}
          </StyledText>
        </View>
      );
    });
  }

  description(item) {
    const ResultStyles = this.props.darkMode ? darkStyles : lightStyles;
    return Object.values(JSON.parse(item.t_mix)).map((word, index) => {
      return <View key={index}>{this.renderDescription(word, ResultStyles)}</View>;
    });
  }

  transcriptions(item) {
    const ResultStyles = this.props.darkMode ? darkStyles : lightStyles;
    return (
      <View style={ResultStyles.transcriptions}>
        <View>
          {item.transcription_us !== null ? (
            <Text>
              <Text style={[ResultStyles.transcriptionWord, {fontStyle: 'italic'}]}>амер. </Text>
              <Text style={[ResultStyles.transcriptionWord, {marginLeft: 7}]}>
                |{item.transcription_us}|
              </Text>
            </Text>
          ) : null}
          {item.transcription_uk !== null ? (
            <Text>
              <Text style={[ResultStyles.transcriptionWord, {fontStyle: 'italic'}]}>брит. </Text>
              <Text style={[ResultStyles.transcriptionWord, {marginLeft: 7}]}>
                |{item.transcription_uk}|
              </Text>
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  render() {
    const ResultStyles = this.props.darkMode ? darkStyles : lightStyles;
    const imgSource = this.state.inDictionary
      ? require('../img/pd_11.png')
      : require('../img/pd_00.png');
    const page = this.state.data.map(item => (
      <View key={item.id} style={ResultStyles.spacer}>
        <View style={ResultStyles.title}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={ResultStyles.titleWord}>
              {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
            </Text>
            <Text style={ResultStyles.rank}>{item.rank}</Text>
          </View>
          <Pressable
            onPress={() =>
              this.onButtonPress(item.t_inline, item.transcription_us, item.transcription_uk)
            }
            android_ripple={ResultStyles.ripple}
            style={ResultStyles.flagButton}>
            <Image source={imgSource} style={ResultStyles.image} />
          </Pressable>
        </View>
        {item.transcription_us !== null || item.transcription_uk !== null
          ? this.transcriptions(item)
          : null}
        <View style={{marginVertical: 10}}>
          <Text style={ResultStyles.translation}>{item.t_inline}</Text>
        </View>
        <View>{this.description(item)}</View>
      </View>
    ));
    return (
      <View style={ResultStyles.body}>
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
  return <ResultPage {...props} _word={word} _id={id} darkMode={darkMode} isFocused={isFocused} />;
}
