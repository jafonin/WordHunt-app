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
  Animated,
  LayoutAnimation,
  TouchableWithoutFeedback,
  UIManager,
  Platform,
} from 'react-native';
import StyledText from 'react-native-styled-text';
import {setData} from '../Components/AddToHistory';
import Header from '../Components/Header';
import {lightStyles} from '../Styles/LightTheme/ResultScreen';
import {darkStyles} from '../Styles/DarkTheme/ResultScreen';
import {defaultDark, defaultLight} from '../Styles/Global';

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
      // value: new Animated.Value(0),
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
    setData(word, id, headerDataTemp[0].t_inline, headerDataTemp[0].transcription_us);
  }
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
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const RenderTitle = ({item}) => {
      return (
        <View>
          <View style={styles.title}>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              <Text style={styles.titleWord}>
                {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
              </Text>
              <Text style={styles.rank}>{item.rank}</Text>
            </View>
            <Pressable
              onPress={() => this.onButtonPress(item.id, item.t_inline)}
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
      // LayoutAnimation.configureNext({
      //   duration: 300,
      //   create: {type: 'linear', property: 'opacity'},
      //   update: {type: 'linear', property: 'opacity'},
      //   delete: {type: 'linear', property: 'opacity'},
      // });
    };

    const renderSection = ({item, index}) => {
      const isExists = this.state.expandedExamples.includes(item.id);
      const example = item.examples.join('\n');
      return (
        <View style={{marginTop: 15}}>
          <Text>
            <Text style={styles.positionNumber}>{index + 1 + '  '}</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                toggleExample(item.id);
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                  //   {
                  //   duration: 300,
                  //   create: {type: 'linear', property: 'opacity'},
                  //   update: {type: 'linear', property: 'opacity'},
                  //   delete: {type: 'linear', property: 'opacity'},
                  // }
                );
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
              style={{
                marginVertical: 3,
              }}>
              {item.examples.map((example, index) => (
                <View key={index} style={{flexDirection: 'row'}}>
                  <Text style={{width: 10}}></Text>
                  <Text>
                    <Text style={styles.translationSentence}>{example}</Text>
                  </Text>
                </View>
              ))}
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
          <View style={styles.spacer}>
            <SectionList
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
              sections={this.state.descriptionData}
              renderItem={renderSection}
              renderSectionHeader={({section}) =>
                section.title.length > 0 ? (
                  <Text style={[styles.translationItalic, {marginTop: 20}]}>{section.title}</Text>
                ) : null
              }
              ListHeaderComponent={<RenderTitle item={this.state.headerData} />}
              keyExtractor={(item, index) => '$item.id - $index'}
              contentContainerStyle={{paddingVertical: 25, paddingHorizontal: 20}}
              // initialNumToRender={20}
              // windowSize={15}
            />
          </View>
        )}
        {/* <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
          {page}
        </ScrollView> */}
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
