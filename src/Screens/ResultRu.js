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
    this.state = {ruEnWordData: [], ruEnWordDicData: [], inDictionary: false};
  }

  componentDidMount() {
    this.setState({ruEnWordData: [], ruEnWordDicData: [], inDictionary: false});
    this.fetchData(this.props._id, this.props._word);
  }

  componentDidUpdate(prevProps) {
    if (prevProps._word !== this.props._word) {
      this.setState({
        ruEnWordData: [],
        ruEnWordDicData: [],
        inDictionary: false,
      });
      this.fetchData(this.props._id, this.props._word);
    }
  }

  fetchData = async (_id, _word) => {
    var ruEnWordQuery = "SELECT * FROM ru_en_word WHERE id = '" + _id + "'";
    await db.transaction(async tx => {
      await tx.executeSql(ruEnWordQuery, [], (tx, results) => {
        var temp = [];
        temp.push(results.rows.item(0));
        this.setState({ruEnWordData: temp});
        // console.log(this.state.ruEnWordData);
      });
    });

    var ruEnWordDicQuery =
      'SELECT ru_en_word_dic.en_word, ru_en_word_dic.tr, ru_en_word_dic.section ' +
      'FROM ru_en_word_dic ' +
      'LEFT JOIN en_ru_word ON en_ru_word.word=ru_en_word_dic.en_word ' +
      "WHERE ru_en_word_dic.ru_word_id = '" +
      _id +
      "'" +
      'ORDER BY section, word_order';
    await db.transaction(async tx => {
      await tx.executeSql(ruEnWordDicQuery, [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({ruEnWordDicData: temp});
        // console.log(temp);
      });
    });

    await dbDic.transaction(async tx => {
      await tx.executeSql(
        "SELECT * FROM dictionary WHERE word = '" + _word + "'",
        [],
        (tx, results) => {
          var dictionaryTemp = [];
          dictionaryTemp.push(results.rows.item(0));
          dictionaryTemp[0].word.length > 0 && this.setState({inDictionary: true});
        },
      );
    });
  };

  updateDictionary(queryUpdate, t_inline) {
    const {_word} = this.props;
    dbDic.transaction(tx => {
      tx.executeSql(queryUpdate, [_word, t_inline]);
    });
  }

  onButtonPress(t_inline) {
    const {_word} = this.props;
    // var toggle = !this.state.inDictionary;
    this.setState({inDictionary: !this.state.inDictionary});
    if (!this.state.inDictionary) {
      dbDic.transaction(tx => {
        tx.executeSql('INSERT OR IGNORE INTO dictionary (word, t_inline) VALUES (?,?)', [
          _word,
          t_inline,
        ]);
        // console.log(t_inline);
      });
    } else {
      dbDic.transaction(tx => {
        tx.executeSql("DELETE FROM dictionary WHERE word = '" + _word + "'", []);
      });
    }
  }

  renderLemma(lemma, word) {
    if (lemma != word) {
      return (
        <View>
          <Text style={ResultStyles.wd_translation_text}>Смотрите также: {lemma}</Text>
        </View>
      );
    }
  }

  render() {
    const renderTitle = this.state.ruEnWordData.map(item => (
      // <ScrollView >
      <View key={item.id}>
        <View style={ResultStyles.wd_title}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={ResultStyles.wd_title_text}>
              {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
            </Text>
            <Text style={ResultStyles.rank}>{item.rank}</Text>
          </View>
          <Pressable
            onPress={() => this.onButtonPress(item.t_inline)}
            style={{
              height: 35,
              width: 35,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.state.inDictionary == false && (
              <Image source={require('../img/pd_00.png')} style={ResultStyles.img} />
            )}
            {this.state.inDictionary == true && (
              <Image source={require('../img/pd_11.png')} style={ResultStyles.img} />
            )}
          </Pressable>
        </View>
        <View style={ResultStyles.wd_translation}>
          <Text style={ResultStyles.wd_translation_text}>{item.t_inline}</Text>
        </View>
        {this.renderLemma(item.lemma, item.word)}
      </View>
      // </ScrollView>
    ));

    const renderBodySectionOne = this.state.ruEnWordDicData.map((item, index) => {
      return (
        <View key={index}>
          {item.section == 1 && (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={ResultStyles.wd_translation_text}>{item.en_word + ' — '}</Text>
              <View>
                {Object.values(JSON.parse(item.tr)).map((words, index) => {
                  return (
                    <View key={index} style={{flex: 1, flexDirection: 'row'}}>
                      {/* <Text> */}
                        {words.map((word, index) => {
                        return (
                          <View key={index}>
                            {/* <Text style={ResultStyles.wd_translation_text}> */}
                              {Object.values(word.l).map((l, index) => {
                                return (
                                  <View key={index}>
                                    <Pressable>
                                      <StyledText style={ResultStyles.wd_translation_text}>
                                        {index + 1 !== Object.values(word.l).length ||
                                        Object.values(word.w).length !== 0
                                          ? l + ', '
                                          : l}
                                        {/* {(Object.values(word.w).length && Object.values(word.l).length) > 0 ? l + ', ' : null} */}
                                      </StyledText>
                                    </Pressable>
                                  </View>
                                );
                              })}
                              {/* {(Object.values(word.l).length && Object.values(word.w).length) >
                                    0 && (
                                    <View>
                                      <Text style={ResultStyles.wd_translation_text}>{', '}</Text>
                                    </View>
                                  )} */}
                              {Object.values(word.w).map((w, index) => {
                                return (
                                  <View key={index}>
                                    <StyledText style={ResultStyles.wd_translation_text}>
                                      {index + 1 !== Object.values(word.w).length ? w + ', ' : w}
                                    </StyledText>
                                  </View>
                                );
                              })}
                            {/* </Text> */}
                          </View>
                        );
                      })}
                      {/* </Text> */}
                      
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      );
    });

    const renderText = (
      <View style={{marginTop: 35}}>
        <Text style={ResultStyles.wd_translation_text_i}>
          Родственные слова, либо редко употребляемые в данном значении
        </Text>
      </View>
    );

    const renderBodySectionTwo = this.state.ruEnWordDicData.map((item, index) => {
      return (
        <View key={index} style={{flexDirection: 'row', flex: 1}}>
          {item.section == 2 && (
            <View style={{flexDirection: 'row', flex: 1, marginVertical: 7}}>
              <Text style={[ResultStyles.wd_translation_text, {textAlign: 'left'}]}>
                {item.en_word + ' — '}
              </Text>
              <View style={{flex: 1}}>
                {Object.values(JSON.parse(item.tr)).map((words, index) => {
                  return (
                    <View key={index}>
                      {words.map((word, index) => {
                        return (
                          <View key={index} style={{flexDirection: 'row'}}>
                            <Text style={ResultStyles.wd_translation_text}>
                              {Object.values(word.l).map((l, index) => {
                                return (
                                  <View key={index}>
                                    <Pressable>
                                      <StyledText style={ResultStyles.wd_translation_text}>
                                        {index + 1 !== Object.values(word.l).length ||
                                        Object.values(word.w).length !== 0
                                          ? l + ', '
                                          : l}
                                      </StyledText>
                                    </Pressable>
                                  </View>
                                );
                              })}
                              {/* {(Object.values(word.l).length && Object.values(word.w).length) >
                                0 && (
                                <View>
                                  <Text style={ResultStyles.wd_translation_text}>{', '}</Text>
                                </View>
                              )} */}
                              {Object.values(word.w).map((w, index) => {
                                return (
                                  <View key={index}>
                                    <StyledText style={ResultStyles.wd_translation_text}>
                                      {index + 1 !== Object.values(word.w).length ? w + ', ' : w}
                                    </StyledText>
                                  </View>
                                );
                              })}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      );
    });

    const renderBody = (
      <View style={ResultStyles.wd}>
        {renderTitle}
        {renderBodySectionOne}
        {renderText}
        {renderBodySectionTwo}
      </View>
    );

    return (
      <View style={{flex: 1}}>
        <Header />
        <ScrollView>{renderBody}</ScrollView>
      </View>
    );
  }
}

export default function ResultRu({route, props}) {
  const {word} = route.params;
  const {id} = route.params;
  // debugger
  return <ResultPage {...props} _word={word} _id={id} />;
}
