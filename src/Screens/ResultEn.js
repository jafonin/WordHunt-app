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
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutRight,
  FadeOutUp,
} from 'react-native-reanimated';
import {deleteDictionaryData, setDictionaryData} from '../Components/AddToDictionary';

const db = openDatabase({name: 'wordhunt_temp.db', createFromLocation: 1});
const dbDic = openDatabase({name: 'UserDictionary.db', createFromLocation: 1});

class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerData: [],
      descriptionData: [],
      descriptionDataCrop: [],
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
      'SELECT id, rank, word, t_inline, transcription_us, transcription_uk ' +
      'FROM en_ru_word ' +
      "WHERE id='" +
      id +
      "'";

    let enRuSentenceDicQuery =
      'SELECT tech_part_of_speach.ru_full, en_ru_word_dic_tr.id, ' +
      "en_ru_word_dic_tr.variant, GROUP_CONCAT(en_ru_sentence.original, '~') as original, GROUP_CONCAT(en_ru_sentence.translation, '~') as translation " +
      'FROM en_ru_word_dic_pos ' +
      'LEFT JOIN tech_part_of_speach ON en_ru_word_dic_pos.pos_code=tech_part_of_speach.code ' +
      'LEFT JOIN en_ru_word_dic_tr ON en_ru_word_dic_pos.id=en_ru_word_dic_tr.pos_id ' +
      'LEFT JOIN en_ru_word_dic_tr_ex ON en_ru_word_dic_tr.id=en_ru_word_dic_tr_ex.tr_id ' +
      'LEFT JOIN en_ru_sentence ON en_ru_word_dic_tr_ex.ex_id=en_ru_sentence.id ' +
      "WHERE en_ru_word_dic_pos.word_id = '" +
      id +
      "' AND en_ru_sentence.original NOT NULL " +
      'GROUP BY en_ru_word_dic_tr.id ORDER BY en_ru_word_dic_pos.pos_order, en_ru_word_dic_tr.tr_order';
    await db.transaction(async tx => {
      await tx.executeSql(enRuWordDicQuery, [], (tx, results) => {
        var headerDataTemp = [];
        headerDataTemp.push(results.rows.item(0));
        this.setState({headerData: headerDataTemp[0]});
        setData(word, id, headerDataTemp[0].t_inline, headerDataTemp[0].transcription_us);
      });
      await tx.executeSql(enRuSentenceDicQuery, [], (tx, results) => {
        this.configureData(results.rows);
      });
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

  configureData(results) {
    var descriptionDataTemp = [];
    for (let i = 0; i < results.length; ++i) {
      descriptionDataTemp.push(results.item(i));
      descriptionDataTemp[i].translation = descriptionDataTemp[i].translation.split('~');
      descriptionDataTemp[i].original = descriptionDataTemp[i].original.split('~');
      descriptionDataTemp[i].examples = descriptionDataTemp[i].original.map(
        (elem, index) => `${elem} — ${descriptionDataTemp[i].translation[index]}`,
      );
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
    var resultCrop = [];
    for (let i = 0; i < result.length; ++i) {
      resultCrop.push({title: result[i].title, data: result[i].data.slice(0, 10)});
    }
    console.log(resultCrop);
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

  loadMore(index, sectionLenght) {
    const temp = this.state.descriptionData[index].data.slice(0, sectionLenght + 11);

    let copyData = [...this.state.descriptionDataCrop];
    copyData[index].data = temp;
    console.log(copyData);

    this.setState(prevState => {
      let copyData = [...prevState.descriptionDataCrop];
      copyData[index].data = temp;
      return {descriptionDataCrop: copyData};
    });
    // console.log(section.data.length);
    // return item.section.data.push(newData);
  }

  render() {
    const styles = this.props.darkMode ? darkStyles : lightStyles;
    const imageSource = this.state.inDictionary
      ? require('../img/pd_11.png')
      : require('../img/pd_00.png');

    const RenderTitle = ({item, index}) => {
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
              <Image source={imageSource} style={styles.image} />
            </Pressable>
          </View>
          <View style={styles.transcriptions}>
            {item.transcription_us.length > 0 && (
              <StyledText
                style={styles.transcriptionWord}
                textStyles={{
                  i: [styles.transcriptionWord, {color: 'gray', fontStyle: 'italic'}],
                }}>
                {'<i>амер.</i> ' + '|' + item.transcription_us + '|'}
              </StyledText>
            )}
            {item.transcription_uk.length > 0 && (
              <StyledText
                style={styles.transcriptionWord}
                textStyles={{
                  i: [styles.transcriptionWord, {color: 'gray', fontStyle: 'italic'}],
                }}>
                {'<i>брит.</i> ' + '|' + item.transcription_uk + '|'}
              </StyledText>
            )}
          </View>
          <View style={{marginVertical: 15}}>
            <Text style={styles.translation}>{item.t_inline}</Text>
          </View>
        </View>
      );
    };

    const renderSection = ({item, index}) => {
      const isExists = this.state.expandedExamples.includes(item.id);
      const example = isExists ? item.examples.join('\n') : null;
      return (
        <View style={{marginTop: 15}} key={index}>
          <Text>
            <Text style={styles.positionNumber}>{index + 1 + '  '}</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                this.toggleExample(item.id);
              }}>
              <StyledText
                style={styles.translation}
                textStyles={{i: [styles.translation, {color: 'gray', fontStyle: 'italic'}]}}>
                {item.variant}
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
    const renderFooter = ({section}) => {
      const index = this.state.descriptionDataCrop.findIndex(sec => sec.title === section.title);
      const sectionLenght = [...section.data].length;
      const dataLenght = [...this.state.descriptionData[index].data].length;

      return (
        <>
          {sectionLenght < dataLenght && (
            <Text
              onPress={() => this.loadMore(index, sectionLenght)}
              style={[styles.translation, {color: 'green', marginVertical: 5}]}>
              Показать еще
            </Text>
          )}
        </>
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
              renderItem={renderSection}
              renderSectionHeader={({section}) => (
                <Text style={[styles.translationItalic, {marginTop: 20}]}>{section.title}</Text>
              )}
              renderSectionFooter={renderFooter}
              ListHeaderComponent={<RenderTitle item={this.state.headerData} />}
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
