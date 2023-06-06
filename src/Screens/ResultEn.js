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
import Animated, {FadeIn, FadeInLeft, FadeOutRight} from 'react-native-reanimated';
import {deleteDictionaryData, setDictionaryData} from '../Components/AddToDictionary';

const db = openDatabase({name: 'wordhunt_temp.db', createFromLocation: 1});
const dbDic = openDatabase({name: 'UserDictionary.db', createFromLocation: 1});

class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerData: [],
      descriptionData: [],
      inDictionary: false,
      isLoading: true,
      expandedExamples: [],
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.fetchData(this.props.id, this.props.word);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.word !== this.props.word || prevProps.isFocused !== this.props.isFocused) {
      this.setState({inDictionary: false, isLoading: true});
      this.fetchData(this.props.id, this.props.word);
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
        this.setState({headerData: headerDataTemp[0], isLoading: false});
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
    this.setState({
      descriptionData: result,
    });
  }
  //ДОБАВИТЬ ТАЙМШТАМП
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

  // renderDescription(word, styles) {
  //   return Object.values(word).map((translation, index) => {
  //     return (
  //       <View key={index} style={{marginVertical: 15}}>
  //         <StyledText style={styles.translationItalic}>{translation.w}</StyledText>
  //         <StyledText style={styles.translation}>{'- ' + translation.t.join('\n\n- ')}</StyledText>
  //       </View>
  //     );
  //   });
  // }
  // ПЕРЕМЕСТИТЬ В RENDER(){  }
  // description(item) {
  //   const styles = this.props.darkMode ? darkStyles : lightStyles;
  //   return Object.values(JSON.parse(item.t_mix)).map((word, index) => {
  //     return <View key={index}>{this.renderDescription(word, styles)}</View>;
  //   });
  // }

  // transcriptions(item) {
  //   const styles = this.props.darkMode ? darkStyles : lightStyles;
  //   return (
  //     <View style={styles.transcriptions}>
  //       <View>
  //         {item.transcription_us !== null ? (
  //           <Text>
  //             <Text style={[styles.transcriptionWord, {fontStyle: 'italic'}]}>амер. </Text>
  //             <Text style={[styles.transcriptionWord, {marginLeft: 7}]}>
  //               |{item.transcription_us}|
  //             </Text>
  //           </Text>
  //         ) : null}
  //         {item.transcription_uk !== null ? (
  //           <Text>
  //             <Text style={[styles.transcriptionWord, {fontStyle: 'italic'}]}>брит. </Text>
  //             <Text style={[styles.transcriptionWord, {marginLeft: 7}]}>
  //               |{item.transcription_uk}|
  //             </Text>
  //           </Text>
  //         ) : null}
  //       </View>
  //     </View>
  //   );
  // }

  render() {
    const styles = this.props.darkMode ? darkStyles : lightStyles;
    const imageSource = this.state.inDictionary
      ? require('../img/pd_11.png')
      : require('../img/pd_00.png');

    const RenderTitle = ({item, index}) => {
      return (
        <View key={index}>
          <View style={styles.title}>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
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
          <View style={{marginTop: 10, marginBottom: 20}}>
            <Text style={styles.translation}>{item.t_inline}</Text>
          </View>
        </View>
      );
    };

    const toggleExample = id => {
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
                toggleExample(item.id);
              }}>
              <StyledText
                style={[styles.translation, {color: defaultDark.lightBlueFont}]}
                textStyles={{i: [styles.translation, {color: 'gray', fontStyle: 'italic'}]}}>
                {item.variant}
              </StyledText>
            </TouchableWithoutFeedback>
          </Text>
          {isExists && (
            <Animated.View
              entering={FadeInLeft}
              exiting={FadeOutRight}
              style={{
                marginVertical: 3,
                flex: 1,
              }}>
              <Text style={styles.translationSentence}>{example}</Text>
            </Animated.View>
          )}
        </View>
      );
    };

    // const page = this.state.headerData.map(item => (
    //   <View key={item.id} style={styles.spacer}>
    //     <View style={styles.title}>
    //       <View style={{flexDirection: 'row', flex: 1}}>
    //         <Text style={styles.titleWord}>
    //           {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
    //         </Text>
    //         <Text style={styles.rank}>{item.rank}</Text>
    //       </View>
    //       <Pressable
    //         onPress={() =>
    //           this.onButtonPress(item.t_inline, item.transcription_us, item.transcription_uk)
    //         }
    //         android_ripple={styles.ripple}
    //         style={styles.flagButton}>
    //         <Image source={imageSource} style={styles.image} />
    //       </Pressable>
    //     </View>
    //     {item.transcription_us !== null || item.transcription_uk !== null
    //       ? this.transcriptions(item)
    //       : null}
    //     <View style={{marginVertical: 10}}>
    //       <Text style={styles.translation}>{item.t_inline}</Text>
    //     </View>
    //     <View>{this.description(item)}</View>
    //   </View>
    // ));
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
          <Animated.View style={styles.spacer} entering={FadeIn}>
            <SectionList
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
              sections={this.state.descriptionData}
              renderItem={renderSection}
              renderSectionHeader={({section}) => (
                <Text style={[styles.translationItalic, {marginTop: 20}]}>{section.title}</Text>
              )}
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
