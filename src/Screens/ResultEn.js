import React, {Component} from 'react';
import {Text, View, Image, Pressable} from 'react-native';
import Header from '../Components/Header';
import {ResultStyles} from '../Styles/ResultScreen';
import {openDatabase} from 'react-native-sqlite-storage';
import {ScrollView} from 'react-native-gesture-handler';
import StyledText from 'react-native-styled-text';

const db = openDatabase({name: 'ru_en_word.db', createFromLocation: 1});
const dbDic = openDatabase({name: 'UserDictionary.db', createFromLocation: 1});

class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {data: [], inDictionary: false};
  }

  componentDidMount() {
    this.setState({data: [], inDictionary: false});
    this.fetchData(this.props._word);
  }

  componentDidUpdate(prevProps) {
    if (prevProps._word !== this.props._word) {
      this.setState({data: [], inDictionary: false});
      this.fetchData(this.props._word);
    }
  }

  fetchData(_word) {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM en_ru_word WHERE t_mix IS NOT '' AND word = '" + _word + "'",
        [],
        (tx, results) => {
          var temp = [];
          temp.push(results.rows.item(0));
          this.setState({data: temp});
          console.log(temp);
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
  }

  // updateDictionary(queryUpdate, t_inline) {
  //   const {_word} = this.props;
  //   dbDic.transaction(tx => {
  //     tx.executeSql(queryUpdate, [_word, t_inline]);
  //   });
  // }

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

  render() {
    const renderPage = this.state.data.map(item => (
      <ScrollView key={item.id}>
        <View style={ResultStyles.wd}>
          <View style={ResultStyles.wd_title}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={ResultStyles.wd_title_text}>
                {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
              </Text>
              <Text style={ResultStyles.rank}>{item.rank}</Text>
            </View>
            <Pressable
              onPress={() =>
                this.onButtonPress(item.t_inline, item.transcription_us, item.transcription_uk)
              }
              style={{height: 35, width: 35, alignItems: 'center', justifyContent: 'center'}}>
              {this.state.inDictionary == false && (
                <Image source={require('../img/pd_00.png')} style={ResultStyles.img} />
              )}
              {this.state.inDictionary == true && (
                <Image source={require('../img/pd_11.png')} style={ResultStyles.img} />
              )}
            </Pressable>
          </View>
          {(item.transcription_us.length > 0 || item.transcription_uk.length > 0) && (
            <View style={ResultStyles.wd_transcription}>
              <View>
                {item.transcription_us.length > 0 && (
                  <Text style={ResultStyles.wd_transcription_text_i}>амер.</Text>
                )}
                {item.transcription_uk.length > 0 && (
                  <Text style={ResultStyles.wd_transcription_text_i}>брит.</Text>
                )}
              </View>
              <View>
                {item.transcription_us.length > 0 && (
                  <Text style={ResultStyles.wd_transcription_text}>|{item.transcription_us}|</Text>
                )}
                {item.transcription_uk.length > 0 && (
                  <Text style={ResultStyles.wd_transcription_text}>|{item.transcription_uk}|</Text>
                )}
              </View>
            </View>
          )}
          <View style={ResultStyles.wd_translation}>
            <Text style={ResultStyles.wd_translation_text}>{item.t_inline}</Text>
          </View>
          <View>
            {Object.values(JSON.parse(item.t_mix)).map((word, index) => {
              return (
                <View key={index}>
                  {Object.values(word).map((translation, index) => {
                    // debugger
                    return (
                      <View key={index} style={ResultStyles.wd_translation}>
                        <StyledText style={ResultStyles.wd_translation_text_i}>
                          {translation.w}
                        </StyledText>
                        <StyledText style={ResultStyles.wd_translation_text}>
                          {'- ' + translation.t.join('\n\n- ')}
                        </StyledText>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    ));
    return (
      <View style={{flex: 1}}>
        <Header />
        {renderPage}
      </View>
    );
  }
}

export default function ResultEn({route, props}) {
  const {word} = route.params;
  return <ResultPage {...props} _word={word} />;
}
