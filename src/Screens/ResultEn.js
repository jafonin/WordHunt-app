import React, {Component} from 'react';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
import {
  Text,
  View,
  Image,
  Pressable,
  SectionList,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import StyledText from 'react-native-styled-text';
import {setData} from '../Components/AddToHistory';
import Header from '../Components/Header';
import {lightStyles} from '../Styles/LightTheme/ResultScreen';
import {darkStyles} from '../Styles/DarkTheme/ResultScreen';
import {defaultDark, defaultLight} from '../Styles/Global';
import Animated, {FadeInDown, FadeInUp, FadeOutDown, FadeOutUp} from 'react-native-reanimated';
import {deleteDictionaryData, setDictionaryData} from '../Components/AddToDictionary';
import Sound from 'react-native-sound';
import sounds from '../Components/soundPath';

const db = openDatabase({name: 'wordhunt_temp.db', createFromLocation: 1});
const dbDic = openDatabase({name: 'UserDictionary.db', createFromLocation: 1});

class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerData: [],
      descriptionData: [],
      descriptionDataCrop: [],
      footerData: [],
      inDictionary: false,
      isLoading: true,
      expandedExamples: [],
    };
  }

  componentDidMount() {
    this.setState({isLoading: true}, () => {
      this.fetchData(this.props.id, this.props.word);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.word !== this.props.word || prevProps.isFocused !== this.props.isFocused) {
      this.setState(
        {inDictionary: false, isLoading: true, headerData: [], descriptionData: []},
        () => {
          this.fetchData(this.props.id, this.props.word);
        },
      );
    }
  }

  fetchData = async (id, word) => {
    let enRuWordDicQuery =
      'SELECT en_ru_word.id, en_ru_word.rank, en_ru_word.word, en_ru_word.t_inline, en_ru_word.transcription_us, ' +
      'en_ru_word.transcription_uk, en_ru_word_dic_word_forms_passive.form, en_ru_word_dic_word_forms_names.name, en_ru_word_dic_word_forms_names.name_str, ' +
      'en_ru_word.sound_us, en_ru_word.sound_uk ' +
      'FROM en_ru_word ' +
      'LEFT JOIN en_ru_word_dic_word_forms_passive ON en_ru_word.id=en_ru_word_dic_word_forms_passive.word_id ' +
      'LEFT JOIN en_ru_word_dic_word_forms_names ON en_ru_word_dic_word_forms_passive.name_id=en_ru_word_dic_word_forms_names.id ' +
      "WHERE en_ru_word.id='" +
      id +
      "'";

    let enRuSentenceDicQuery =
      'SELECT tech_part_of_speach.ru_full, en_ru_word_dic_tr.id, en_ru_word_dic_tr.variant, ' +
      "GROUP_CONCAT(en_ru_sentence.original, '~') as original, GROUP_CONCAT(en_ru_sentence.translation, '~') as translation " +
      'FROM en_ru_word_dic_pos ' +
      'LEFT JOIN tech_part_of_speach ON en_ru_word_dic_pos.pos_code=tech_part_of_speach.code ' +
      'LEFT JOIN en_ru_word_dic_tr ON en_ru_word_dic_pos.id=en_ru_word_dic_tr.pos_id ' +
      'LEFT JOIN en_ru_word_dic_tr_ex ON en_ru_word_dic_tr.id=en_ru_word_dic_tr_ex.tr_id ' +
      'LEFT JOIN en_ru_sentence ON en_ru_word_dic_tr_ex.ex_id=en_ru_sentence.id ' +
      "WHERE en_ru_word_dic_pos.word_id = '" +
      id +
      "' " +
      'GROUP BY en_ru_word_dic_tr.id ORDER BY en_ru_word_dic_pos.pos_order, en_ru_word_dic_tr.tr_order';

    let enRuFormsDicQuery =
      "SELECT GROUP_CONCAT(en_ru_word_dic_word_forms_names.name_str, '~') as name_str, " +
      "GROUP_CONCAT(en_ru_word_dic_word_forms.form, '~') as form, tech_part_of_speach.en_full " +
      'FROM en_ru_word_dic_word_forms ' +
      'LEFT JOIN en_ru_word_dic_word_forms_names ON en_ru_word_dic_word_forms.name_id=en_ru_word_dic_word_forms_names.id ' +
      'LEFT JOIN tech_part_of_speach ON en_ru_word_dic_word_forms.pos_code=tech_part_of_speach.code ' +
      "WHERE en_ru_word_dic_word_forms.word_id= '" +
      id +
      "' GROUP BY tech_part_of_speach.en_full ORDER BY tech_part_of_speach.code DESC";
    await db.transaction(async tx => {
      await tx.executeSql(enRuWordDicQuery, [], (tx, results) => {
        let headerDataTemp = [];
        headerDataTemp.push(results.rows.item(0));
        this.setState({headerData: headerDataTemp[0]});
        setData(word, id, headerDataTemp[0].t_inline, headerDataTemp[0].transcription_us);
      });
      await tx.executeSql(enRuSentenceDicQuery, [], (tx, results) => {
        this.configureData(results.rows);
      });
      await tx.executeSql(enRuFormsDicQuery, [], (tx, results) => {
        let footerDataTemp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          footerDataTemp.push(results.rows.item(i));
          footerDataTemp[i].name_str = footerDataTemp[i].name_str.split('~');
          footerDataTemp[i].form = footerDataTemp[i].form.split('~');
          footerDataTemp[i].forms_names = footerDataTemp[i].form.map(
            (elem, index) => `<i>${footerDataTemp[i].name_str[index]}:</i> ${elem}`,
          );
          delete footerDataTemp[i].form;
          delete footerDataTemp[i].name_str;
        }

        this.setState({footerData: footerDataTemp});
      });
    });
    await dbDic.transaction(async tx => {
      await tx.executeSql(
        "SELECT * FROM dictionary WHERE word = '" + word + "'",
        [],
        (tx, results) => {
          let dictionaryTemp = [];
          dictionaryTemp.push(results.rows.item(0));
          dictionaryTemp[0].word.length > 0 && this.setState({inDictionary: true});
        },
      );
    });
  };

  configureData(results) {
    let descriptionDataTemp = [];
    for (let i = 0; i < results.length; ++i) {
      descriptionDataTemp.push(results.item(i));
      if (descriptionDataTemp[i].original != null) {
        descriptionDataTemp[i].translation = descriptionDataTemp[i].translation.split('~');
        descriptionDataTemp[i].original = descriptionDataTemp[i].original.split('~');
        descriptionDataTemp[i].examples = descriptionDataTemp[i].original.map(
          (elem, index) => `${elem} — ${descriptionDataTemp[i].translation[index]}`,
        );
      }
      delete descriptionDataTemp[i].translation;
      delete descriptionDataTemp[i].original;
    }

    const groupedData = descriptionDataTemp.reduce((acc, item) => {
      if (!acc[item.ru_full]) {
        acc[item.ru_full] = {title: item.ru_full, data: []};
      }
      acc[item.ru_full].data.push(item);
      return acc;
    }, {});

    const result = Object.values(groupedData);
    let resultCrop = [];
    for (let i = 0; i < result.length; ++i) {
      resultCrop.push({title: result[i].title, data: result[i].data.slice(0, 10)});
    }
    this.setState({
      descriptionData: result,
      descriptionDataCrop: resultCrop,
      isLoading: false,
    });
  }

  onButtonPress(t_inline, transcription_us, transcription_uk = null) {
    const {word} = this.props;
    const {id} = this.props;

    if (!this.state.inDictionary) {
      setDictionaryData(word, id, t_inline, transcription_us, transcription_uk);
    } else {
      deleteDictionaryData(word, id);
    }
    this.setState(prevState => ({inDictionary: !prevState.inDictionary}));
  }

  toggleExample(id) {
    this.setState(prevState => {
      const expandedExamples = [...prevState.expandedExamples];
      const existingIndex = expandedExamples.indexOf(id);

      if (expandedExamples.includes(id)) {
        expandedExamples.splice(existingIndex, 1);
      } else {
        expandedExamples.push(id);
      }

      return {expandedExamples};
    });
  }

  loadCrop(index, sectionLenght) {
    const temp = this.state.descriptionData[index].data.slice(0, sectionLenght + 11);

    this.setState(prevState => {
      let copyData = [...prevState.descriptionDataCrop];
      copyData[index].data = temp;
      return {descriptionDataCrop: copyData};
    });
  }
  playSound(sound) {
    const soundVar = new Sound(sound, error => {
      if (error) {
        console.log(error);
      } else {
        soundVar.play(success => {
          success ? null : console.log('error');
        });
      }
    });
    // setTimeout(() => {
    //   soundVar.play();
    // }, 100);
    // soundVar.release();
  }

  render() {
    const styles = this.props.darkMode ? darkStyles : lightStyles;
    const dictImage = this.state.inDictionary
      ? require('../../android/app/src/main/assets/www/img/pd_11.png')
      : require('../../android/app/src/main/assets/www/img/pd_00.png');
    const playImage = require('../../android/app/src/main/assets/www/img/audio-black.png');

    const Title = ({item, index}) => {
      return (
        <View key={index}>
          <View style={styles.title}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={styles.titleWord}>
                {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
              </Text>
              <Text style={styles.rank}>{item.rank}</Text>
            </View>
            <Pressable
              onPress={() => this.onButtonPress(item.t_inline, item.transcription_us)}
              android_ripple={styles.ripple}
              style={styles.flagButton}>
              <Image source={dictImage} style={styles.image} />
            </Pressable>
          </View>
          <View style={styles.transcriptions}>
            {item.transcription_us.length > 0 && (
              <View style={{flexDirection: 'row', marginRight: 20}}>
                <StyledText
                  style={styles.transcriptionWord}
                  textStyles={{
                    i: [styles.transcriptionWord, {color: 'gray', fontStyle: 'italic'}],
                  }}>
                  {'<i>амер.</i> ' + '|' + item.transcription_us + '|'}
                </StyledText>
                {item.word in sounds.us && (
                  <Pressable
                    style={{marginLeft: 10}}
                    onPress={() => this.playSound(sounds.us[item.word])}>
                    <Image source={playImage} style={{width: 31, height: 31}} />
                  </Pressable>
                )}
              </View>
            )}
            {item.transcription_uk.length > 0 && (
              <View style={{flexDirection: 'row'}}>
                <StyledText
                  style={styles.transcriptionWord}
                  textStyles={{
                    i: [styles.transcriptionWord, {color: 'gray', fontStyle: 'italic'}],
                  }}>
                  {'<i>брит.</i> ' + '|' + item.transcription_uk + '|'}
                </StyledText>
                {item.word in sounds.uk && (
                  <Pressable
                    style={{marginLeft: 10}}
                    onPress={() => {
                      this.playSound(sounds.uk[item.word]);
                    }}>
                    <Image source={playImage} style={{width: 31, height: 31}} />
                  </Pressable>
                )}
              </View>
            )}
          </View>
          <View style={{marginVertical: 15}}>
            <Text style={styles.translation}>{item.t_inline}</Text>
          </View>
        </View>
      );
    };

    const section = ({item, index}) => {
      const isExists = this.state.expandedExamples.includes(item.id);
      const example = isExists ? item.examples.join('\n') : null;
      return (
        <View style={{marginTop: 15}} key={index}>
          <Text>
            <Text
              style={[
                styles.positionNumber,
                item.examples != null ? {textDecorationLine: 'underline'} : null,
              ]}>
              {index + 1}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                item.examples != null ? this.toggleExample(item.id) : null;
              }}>
              <StyledText
                style={[styles.translation]}
                textStyles={{
                  i: [
                    {
                      color: 'gray',
                      fontStyle: 'italic',
                      fontSize: 16,
                    },
                  ],
                }}>
                {'  ' + item.variant}
              </StyledText>
            </TouchableWithoutFeedback>
          </Text>
          {isExists && (
            <Animated.View
              entering={FadeInUp}
              exiting={FadeOutUp.duration(200)}
              style={{
                marginVertical: 3,
                marginLeft: 20,
                flex: 1,
              }}>
              <Text style={styles.translationSentence}>{example}</Text>
            </Animated.View>
          )}
        </View>
      );
    };
    const sectionFooter = ({section}) => {
      const index = this.state.descriptionDataCrop.findIndex(sec => sec.title === section.title);
      const sectionLenght = [...section.data].length;
      const dataLenght = [...this.state.descriptionData[index].data].length;

      return (
        <View style={{flexDirection: 'row'}}>
          {sectionLenght < dataLenght && (
            <Text
              onPress={() => this.loadCrop(index, sectionLenght)}
              style={[styles.translation, {color: 'green', marginVertical: 5, marginRight: 5}]}>
              Показать еще
            </Text>
          )}
          {sectionLenght > 10 && (
            <Text
              onPress={() => this.loadCrop(index, -1)}
              style={[styles.translation, {color: 'gray', marginVertical: 5}]}>
              Свернуть
            </Text>
          )}
        </View>
      );
    };
    const Footer = ({item, index}) => {
      return (
        item.length > 0 && (
          <View key={index}>
            <Text style={[styles.translationItalic, {marginTop: 20}]}>Формы слова</Text>
            <View>
              {item.map((partOfSpeech, index) => {
                return (
                  <View key={index} style={{marginVertical: 10}}>
                    <Text style={styles.translationSentence}>{partOfSpeech.en_full}</Text>
                    {partOfSpeech.forms_names.map((form_name, index) => {
                      return (
                        <View key={index}>
                          <StyledText
                            style={styles.translationSentence}
                            textStyles={{
                              i: [
                                {
                                  color: 'gray',
                                  fontStyle: 'italic',
                                  fontSize: 16,
                                },
                              ],
                            }}>
                            {form_name}
                          </StyledText>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </View>
        )
      );
    };

    const keyExtractor = item => item.id.toString();
    return (
      <View style={styles.body}>
        <Header darkMode={this.props.darkMode} />

        {this.state.isLoading ? (
          <ActivityIndicator
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            size="large"
            color="#007AFF"
          />
        ) : (
          <Animated.View style={styles.spacer} entering={FadeInDown} exiting={FadeOutDown}>
            <SectionList
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
              sections={this.state.descriptionDataCrop}
              renderItem={section}
              renderSectionHeader={({section}) => (
                <Text style={[styles.translationItalic, {marginTop: 20}]}>{section.title}</Text>
              )}
              renderSectionFooter={sectionFooter}
              ListHeaderComponent={<Title item={this.state.headerData} />}
              ListFooterComponent={<Footer item={this.state.footerData} />}
              keyExtractor={keyExtractor}
              contentContainerStyle={{flexGrow: 1, paddingVertical: 25, paddingHorizontal: 20}}
            />
          </Animated.View>
        )}
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
