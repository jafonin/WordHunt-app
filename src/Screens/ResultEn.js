import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  Pressable,
  SectionList,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {useRoute, useIsFocused, useNavigation} from '@react-navigation/native';
import StyledText from 'react-native-styled-text';
import Sound from 'react-native-sound';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import Header from '../Components/Header';
import {setData} from '../Components/AddToHistory';
import {deleteDictionaryData, setDictionaryData} from '../Components/AddToDictionary';
import {lightStyles} from '../Styles/LightTheme/ResultScreen';
import {darkStyles} from '../Styles/DarkTheme/ResultScreen';

import { getWordFullDetails } from '../Services/Database';

const getSoundFileName = (word) => {
  if (!word) return null;
  return word
    .toLowerCase()
    .trim()
    .replace(/ /g, '_')
    .replace(/[^a-z_]/g, '') + '.mp3';
};

const ResultEn = ({ darkMode }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {word, id} = route.params;

  const [headerData, setHeaderData] = useState(null);
  const [descriptionData, setDescriptionData] = useState([]);
  const [descriptionDataCrop, setDescriptionDataCrop] = useState([]);
  const [footerData, setFooterData] = useState([]);
  const [inDictionary, setInDictionary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedExamples, setExpandedExamples] = useState([]);

  const styles = darkMode ? darkStyles : lightStyles;
  const dictImage = inDictionary
    ? require('../../android/app/src/main/assets/img/pd_11.png')
    : require('../../android/app/src/main/assets/img/pd_00.png');
  const playImage = require('../../android/app/src/main/assets/img/audio-black.png');

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setIsLoading(true);
      setHeaderData(null);
      setDescriptionData([]);
      setFooterData([]);

      try {

        const data = await getWordFullDetails(id, word);

        if (!isMounted) return;

        if (data.header) {
          setHeaderData(data.header);
          setData(word, id, data.header.t_inline, data.header.transcription_us);
        }

        processDescriptionData(data.sentences);
        processFooterData(data.forms);
        setInDictionary(data.inDictionary);

      } catch (error) {
        console.error("Error loading word details:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (isFocused) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [id, word, isFocused]);

  const processDescriptionData = (rawRows) => {
    let tempDesc = [];

    for (let i = 0; i < rawRows.length; ++i) {
      let item = {...rawRows[i]};
      if (item.original != null) {
        item.translation = item.translation.split('~');
        item.original = item.original.split('~');
        item.examples = item.original.map(
          (elem, index) => `${elem} — ${item.translation[index]}`,
        );
      }

      delete item.translation;
      delete item.original;
      tempDesc.push(item);
    }

    const groupedData = tempDesc.reduce((acc, item) => {
      if (!acc[item.ru_full]) {
        acc[item.ru_full] = {title: item.ru_full, data: []};
      }
      acc[item.ru_full].data.push(item);
      return acc;
    }, {});
    
    const result = Object.values(groupedData);
    let resultCrop = result.map(section => ({
      title: section.title,
      data: section.data.slice(0, 10),
    }));
    
    setDescriptionData(result);
    setDescriptionDataCrop(resultCrop);
  };

  const processFooterData = (rawRows) => {
    let tempFooter = [];
    for (let i = 0; i < rawRows.length; ++i) {
      let item = {...rawRows[i]};

      if (item.name_str && item.form) {
        const names = item.name_str.split('~');
        const forms = item.form.split('~');
        item.forms_names = forms.map(
          (elem, index) => `<i>${names[index]}:</i> ${elem}`,
        );
        delete item.form;
        delete item.name_str;
        tempFooter.push(item);
      }
    };
    setFooterData(tempFooter);
  };

  const handleDictionaryPress = () => {
    if (!headerData) return;
    if (!inDictionary) {
      setDictionaryData(word, id, headerData.t_inline, headerData.transcription_us);
    } else {
      deleteDictionaryData(word, id);
    }
    setInDictionary(prev => !prev);
  };

  const toggleExample = (itemId) => {
    setExpandedExamples(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const loadCrop = (index, currentLength) => {
    const ifCollapsing = currentLength === -1;

    setDescriptionDataCrop(prev => {
      const newData = [...prev];
      newData[index] = {...newData[index]};

      if (ifCollapsing) {
        newData[index].data = newData[index].data.slice(0, 10);
      } else {
        const newSlice = descriptionData[index].data.slice(0, currentLength + 11);
        newData[index].data = newSlice;
      }
      return newData;
    });
  };

  const playSound = (wordText, type) => {
    const fileName = getSoundFileName(wordText);
    const path = `${type}/${fileName}`;

    const soundVar = new Sound(path, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Ошибка загрузки звука:', error);
      } else {
        soundVar.play((success) => {
          soundVar.release(); // Освобождаем память после проигрывания
        });
      }
    });
  };

  const renderTitle = () => {
    if (!headerData) return null;
    const item = headerData;

    return (
      <View>
        <View style={styles.title}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={styles.titleWord}>
              {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
            </Text>
            <Text style={styles.rank}>{item.rank}</Text>
          </View>
          <Pressable
            onPress={handleDictionaryPress}
            android_ripple={styles.ripple}
            style={styles.flagButton}>
            <Image source={dictImage} style={styles.image} />
          </Pressable>
        </View>

        <View style={styles.transcriptions}>
            {item.transcription_us && item.transcription_us.length > 0 && (
              <View style={{flexDirection: 'row', marginRight: 20, marginBottom: 20}}>
                <StyledText style={styles.transcriptionWord} textStyles={{i: [styles.transcriptionWord, {color: 'gray', fontStyle: 'italic'}]}}>
                  {'<i>амер.</i> ' + '|' + item.transcription_us + '|'}
                </StyledText>
                
                {item.sound_us === 1 && (
                  <Pressable
                    style={{marginLeft: 10}}
                    onPress={() => playSound(item.word, 'us')}>
                    <Image source={playImage} style={{width: 31, height: 31}} />
                  </Pressable>
                )}
              </View>
            )}


            {item.transcription_uk && item.transcription_uk.length > 0 && (
              <View style={{flexDirection: 'row', marginBottom: 20}}>
                <StyledText style={styles.transcriptionWord} textStyles={{i: [styles.transcriptionWord, {color: 'gray', fontStyle: 'italic'}]}}>
                  {'<i>брит.</i> ' + '|' + item.transcription_uk + '|'}
                </StyledText>
                

                {item.sound_uk === 1 && (
                  <Pressable
                    style={{marginLeft: 10}}
                    onPress={() => playSound(item.word, 'uk')}>
                    <Image source={playImage} style={{width: 31, height: 31}} />
                  </Pressable>
                )}
              </View>
            )}
          </View>

          <View style={{marginTop: 5}}>
            <Text style={styles.translation}>{item.t_inline}</Text>
          </View>
        </View>
    );
  };
  const renderFooter = () => {
    if (footerData.length === 0) return null;
    return (
        <View>
            <Text style={[styles.translationItalic, {marginTop: 20}]}>Формы слова</Text>
            <View>
                {footerData.map((partOfSpeech, index) => (
                    <View key={index} style={{marginVertical: 10}}>
                        <Text style={styles.translationSentence}>{partOfSpeech.en_full}</Text>
                        {partOfSpeech.forms_names.map((form_name, idx) => (
                            <StyledText key={idx} style={styles.translationSentence} textStyles={{i: [{color: 'gray', fontStyle: 'italic', fontSize: 16}]}}>
                                {form_name}
                            </StyledText>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
  };

  const renderSectionItem = ({ item, index }) => {
    const isExpanded = expandedExamples.includes(item.id);

    return (
      <View style={{marginTop: 15}}>
        <Text>
          <Text style={[styles.positionNumber, item.examples ? {textDecorationLine: 'underline'} : null]}>
            {index + 1}
          </Text>
          <TouchableWithoutFeedback onPress={() => item.examples && toggleExample(item.id)}>
            <StyledText style={styles.translation} textStyles={{i: [{color: 'gray', fontStyle: 'italic', fontSize: 16}]}}>
              {'  ' + item.variant}
            </StyledText>
          </TouchableWithoutFeedback>
        </Text>
        
        {isExpanded && item.examples && (
          <Animated.View entering={FadeInUp} exiting={FadeOutUp.duration(200)} style={{marginVertical: 3, marginLeft: 20, flex: 1}}>
            <Text style={styles.translationSentence}>
                {item.examples.join('\n\n')}
            </Text>
          </Animated.View>
        )}
      </View>
    );
  };

  const renderSectionFooter = ({ section }) => {
    const fullSectionIndex = descriptionData.findIndex(s => s.title === section.title);

    if (fullSectionIndex === -1) return null;

    const currentLen = section.data.length;
    const totalLen = descriptionData[fullSectionIndex].data.length;

    return (
      <View style={{flexDirection: 'row'}}>
        {currentLen < totalLen && (
          <Text
            onPress={() => loadCrop(fullSectionIndex, currentLen)}
            style={[styles.translation, {color: 'green', marginVertical: 5, marginRight: 5}]}>
            Показать еще
          </Text>
        )}
        {currentLen > 10 && (
          <Text
            onPress={() => loadCrop(fullSectionIndex, -1)}
            style={[styles.translation, {color: 'gray', marginVertical: 5}]}>
            Свернуть
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.body}>
      <Header darkMode={darkMode} />

      {isLoading ? (
        <ActivityIndicator
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          size="large"
          color="#007AFF"
        />
      ) : (
        <SectionList
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          sections={descriptionDataCrop}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSectionItem}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.translationItalic, {marginTop: 20}]}>{section.title}</Text>
          )}
          renderSectionFooter={renderSectionFooter}
          ListHeaderComponent={renderTitle}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{flexGrow: 1, paddingVertical: 25, paddingHorizontal: 20}}
        />
      )}
    </View>
  );
};

export default ResultEn;



// class ResultPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       headerData: [],
//       descriptionData: [],
//       descriptionDataCrop: [],
//       footerData: [],
//       inDictionary: false,
//       isLoading: true,
//       expandedExamples: [],
//     };
//   }

//   componentDidMount() {
//     this.setState({isLoading: true}, () => {
//       this.fetchData(this.props.id, this.props.word);
//     });
//   }

//   componentDidUpdate(prevProps) {
//     if (prevProps.word !== this.props.word || prevProps.isFocused !== this.props.isFocused) {
//       this.setState(
//         {inDictionary: false, isLoading: true, headerData: [], descriptionData: []},
//         () => {
//           this.fetchData(this.props.id, this.props.word);
//         },
//       );
//     }
//   }

//   fetchData = async (id, word) => {
//     let enRuWordDicQuery =
//       'SELECT en_ru_word.id, en_ru_word.rank, en_ru_word.word, en_ru_word.t_inline, en_ru_word.transcription_us, ' +
//       'en_ru_word.transcription_uk, en_ru_word_dic_word_forms_passive.form, en_ru_word_dic_word_forms_names.name, en_ru_word_dic_word_forms_names.name_str, ' +
//       'en_ru_word.sound_us, en_ru_word.sound_uk ' +
//       'FROM en_ru_word ' +
//       'LEFT JOIN en_ru_word_dic_word_forms_passive ON en_ru_word.id=en_ru_word_dic_word_forms_passive.word_id ' +
//       'LEFT JOIN en_ru_word_dic_word_forms_names ON en_ru_word_dic_word_forms_passive.name_id=en_ru_word_dic_word_forms_names.id ' +
//       "WHERE en_ru_word.id='" +
//       id +
//       "'";

//     let enRuSentenceDicQuery =
//       'SELECT tech_part_of_speach.ru_full, en_ru_word_dic_tr.id, en_ru_word_dic_tr.variant, ' +
//       "GROUP_CONCAT(en_ru_sentence.original, '~') as original, GROUP_CONCAT(en_ru_sentence.translation, '~') as translation " +
//       'FROM en_ru_word_dic_pos ' +
//       'LEFT JOIN tech_part_of_speach ON en_ru_word_dic_pos.pos_code=tech_part_of_speach.code ' +
//       'LEFT JOIN en_ru_word_dic_tr ON en_ru_word_dic_pos.id=en_ru_word_dic_tr.pos_id ' +
//       'LEFT JOIN en_ru_word_dic_tr_ex ON en_ru_word_dic_tr.id=en_ru_word_dic_tr_ex.tr_id ' +
//       'LEFT JOIN en_ru_sentence ON en_ru_word_dic_tr_ex.ex_id=en_ru_sentence.id ' +
//       "WHERE en_ru_word_dic_pos.word_id = '" +
//       id +
//       "' " +
//       'GROUP BY en_ru_word_dic_tr.id ORDER BY en_ru_word_dic_pos.pos_order, en_ru_word_dic_tr.tr_order';

//     let enRuFormsDicQuery =
//       "SELECT GROUP_CONCAT(en_ru_word_dic_word_forms_names.name_str, '~') as name_str, " +
//       "GROUP_CONCAT(en_ru_word_dic_word_forms.form, '~') as form, tech_part_of_speach.en_full " +
//       'FROM en_ru_word_dic_word_forms ' +
//       'LEFT JOIN en_ru_word_dic_word_forms_names ON en_ru_word_dic_word_forms.name_id=en_ru_word_dic_word_forms_names.id ' +
//       'LEFT JOIN tech_part_of_speach ON en_ru_word_dic_word_forms.pos_code=tech_part_of_speach.code ' +
//       "WHERE en_ru_word_dic_word_forms.word_id= '" +
//       id +
//       "' GROUP BY tech_part_of_speach.en_full ORDER BY tech_part_of_speach.code DESC";
//     await db.transaction(async tx => {
//       await tx.executeSql(enRuWordDicQuery, [], (tx, results) => {
//         let headerDataTemp = [];
//         headerDataTemp.push(results.rows.item(0));
//         this.setState({headerData: headerDataTemp[0]});
//         setData(word, id, headerDataTemp[0].t_inline, headerDataTemp[0].transcription_us);
//       });
//       await tx.executeSql(enRuSentenceDicQuery, [], (tx, results) => {
//         this.configureData(results.rows);
//       });
//       await tx.executeSql(enRuFormsDicQuery, [], (tx, results) => {
//         let footerDataTemp = [];
//         for (let i = 0; i < results.rows.length; ++i) {
//           footerDataTemp.push(results.rows.item(i));
//           footerDataTemp[i].name_str = footerDataTemp[i].name_str.split('~');
//           footerDataTemp[i].form = footerDataTemp[i].form.split('~');
//           footerDataTemp[i].forms_names = footerDataTemp[i].form.map(
//             (elem, index) => `<i>${footerDataTemp[i].name_str[index]}:</i> ${elem}`,
//           );
//           delete footerDataTemp[i].form;
//           delete footerDataTemp[i].name_str;
//         }

//         this.setState({footerData: footerDataTemp});
//       });
//     });
//     await dbDic.transaction(async tx => {
//       await tx.executeSql(
//         "SELECT * FROM dictionary WHERE word = '" + word + "'",
//         [],
//         (tx, results) => {
//           let dictionaryTemp = [];
//           dictionaryTemp.push(results.rows.item(0));
//           dictionaryTemp[0].word.length > 0 && this.setState({inDictionary: true});
//         },
//       );
//     });
//   };

//   configureData(results) {
//     let descriptionDataTemp = [];
//     for (let i = 0; i < results.length; ++i) {
//       descriptionDataTemp.push(results.item(i));
//       if (descriptionDataTemp[i].original != null) {
//         descriptionDataTemp[i].translation = descriptionDataTemp[i].translation.split('~');
//         descriptionDataTemp[i].original = descriptionDataTemp[i].original.split('~');
//         descriptionDataTemp[i].examples = descriptionDataTemp[i].original.map(
//           (elem, index) => `${elem} — ${descriptionDataTemp[i].translation[index]}`,
//         );
//       }
//       delete descriptionDataTemp[i].translation;
//       delete descriptionDataTemp[i].original;
//     }

//     const groupedData = descriptionDataTemp.reduce((acc, item) => {
//       if (!acc[item.ru_full]) {
//         acc[item.ru_full] = {title: item.ru_full, data: []};
//       }
//       acc[item.ru_full].data.push(item);
//       return acc;
//     }, {});

//     const result = Object.values(groupedData);
//     let resultCrop = [];
//     for (let i = 0; i < result.length; ++i) {
//       resultCrop.push({title: result[i].title, data: result[i].data.slice(0, 10)});
//     }
//     this.setState({
//       descriptionData: result,
//       descriptionDataCrop: resultCrop,
//       isLoading: false,
//     });
//   }

//   onButtonPress(t_inline, transcription_us, transcription_uk = null) {
//     const {word} = this.props;
//     const {id} = this.props;

//     if (!this.state.inDictionary) {
//       setDictionaryData(word, id, t_inline, transcription_us, transcription_uk);
//     } else {
//       deleteDictionaryData(word, id);
//     }
//     this.setState(prevState => ({inDictionary: !prevState.inDictionary}));
//   }

//   toggleExample(id) {
//     this.setState(prevState => {
//       const expandedExamples = [...prevState.expandedExamples];
//       const existingIndex = expandedExamples.indexOf(id);

//       if (expandedExamples.includes(id)) {
//         expandedExamples.splice(existingIndex, 1);
//       } else {
//         expandedExamples.push(id);
//       }

//       return {expandedExamples};
//     });
//   }

//   loadCrop(index, sectionLenght) {
//     const temp = this.state.descriptionData[index].data.slice(0, sectionLenght + 11);

//     this.setState(prevState => {
//       let copyData = [...prevState.descriptionDataCrop];
//       copyData[index].data = temp;
//       return {descriptionDataCrop: copyData};
//     });
//   }
// playSound(sound) {
//   // Проверка на случай, если sound пришел пустым
//   if (!sound) return;

//   const soundVar = new Sound(sound, error => {
//     if (error) {
//       console.log('Ошибка загрузки звука:', error);
//     } else {
//       soundVar.play(success => {
//         if (!success) console.log('Ошибка воспроизведения');
//         soundVar.release(); // Освобождаем память после проигрывания
//       });
//     }
//   });
// }

//   render() {
//     const styles = this.props.darkMode ? darkStyles : lightStyles;
//     const dictImage = this.state.inDictionary
//       ? require('../../android/app/src/main/assets/img/pd_11.png')
//       : require('../../android/app/src/main/assets/img/pd_00.png');
//     const playImage = require('../../android/app/src/main/assets/img/audio-black.png');

//     const Title = ({item, index}) => {
//       return (
//         <View key={index}>
//           <View style={styles.title}>
//             <View style={{flexDirection: 'row', flex: 1}}>
//               <Text style={styles.titleWord}>
//                 {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
//               </Text>
//               <Text style={styles.rank}>{item.rank}</Text>
//             </View>
//             <Pressable
//               onPress={() => this.onButtonPress(item.t_inline, item.transcription_us)}
//               android_ripple={styles.ripple}
//               style={styles.flagButton}>
//               <Image source={dictImage} style={styles.image} />
//             </Pressable>
//           </View>
//           <View style={styles.transcriptions}>
//             {item.transcription_us.length > 0 && (
//               <View style={{flexDirection: 'row', marginRight: 20, marginBottom: 20}}>
//                 <StyledText
//                   style={styles.transcriptionWord}
//                   textStyles={{
//                     i: [styles.transcriptionWord, {color: 'gray', fontStyle: 'italic'}],
//                   }}>
//                   {'<i>амер.</i> ' + '|' + item.transcription_us + '|'}
//                 </StyledText>
//                 {item.word in sounds.us && (
//                   <Pressable
//                     style={{marginLeft: 10}}
//                     onPress={() => {
//                       const wordKey = item.word.toLowerCase().trim();
//                       const soundResource = sounds.us[wordKey];
//                       if (soundResource) {
//                         this.playSound(soundResource);
//                       } else {
//                         console.warn("Звук не найден для:", wordKey);
//                       }
//                     }}>
//                     <Image source={playImage} style={{width: 31, height: 31}} />
//                   </Pressable>
//                 )}
//               </View>
//             )}
//             {item.transcription_uk.length > 0 && (
//               <View style={{flexDirection: 'row', marginBottom: 20}}>
//                 <StyledText
//                   style={styles.transcriptionWord}
//                   textStyles={{
//                     i: [styles.transcriptionWord, {color: 'gray', fontStyle: 'italic'}],
//                   }}>
//                   {'<i>брит.</i> ' + '|' + item.transcription_uk + '|'}
//                 </StyledText>
//                 {item.word in sounds.uk && (
//                   <Pressable
//                     style={{marginLeft: 10}}
//                     onPress={() => {
//                       this.playSound(sounds.uk[item.word]);
//                     }}>
//                     <Image source={playImage} style={{width: 31, height: 31}} />
//                   </Pressable>
//                 )}
//               </View>
//             )}
//           </View>
//           <View style={{marginTop: 5}}>
//             <Text style={styles.translation}>{item.t_inline}</Text>
//           </View>
//         </View>
//       );
//     };

//     const section = ({item, index}) => {
//       const isExists = this.state.expandedExamples.includes(item.id);

//       return (
//         <View style={{marginTop: 15}} key={index}>
//           <Text>
//             <Text
//               style={[
//                 styles.positionNumber,
//                 item.examples != null ? {textDecorationLine: 'underline'} : null,
//               ]}>
//               {index + 1}
//             </Text>
//             <TouchableWithoutFeedback
//               onPress={() => {
//                 item.examples != null ? this.toggleExample(item.id) : null;
//               }}>
//               <StyledText
//                 style={[styles.translation]}
//                 textStyles={{
//                   i: [
//                     {
//                       color: 'gray',
//                       fontStyle: 'italic',
//                       fontSize: 16,
//                     },
//                   ],
//                 }}>
//                 {'  ' + item.variant}
//               </StyledText>
//             </TouchableWithoutFeedback>
//           </Text>
//           {isExists && (
//             <Animated.View
//               entering={FadeInUp}
//               exiting={FadeOutUp.duration(200)}
//               style={{
//                 marginVertical: 3,
//                 marginLeft: 20,
//                 flex: 1,
//               }}>
//               <Text style={styles.translationSentence}>{isExists ? item.examples.join('\n\n') : ''}</Text>
//             </Animated.View>
//           )}
//         </View>
//       );
//     };

    
//     const sectionFooter = ({section}) => {
//       const index = this.state.descriptionDataCrop.findIndex(sec => sec.title === section.title);
//       const sectionLenght = [...section.data].length;
//       const dataLenght = [...this.state.descriptionData[index].data].length;

//       return (
//         <View style={{flexDirection: 'row'}}>
//           {sectionLenght < dataLenght && (
//             <Text
//               onPress={() => this.loadCrop(index, sectionLenght)}
//               style={[styles.translation, {color: 'green', marginVertical: 5, marginRight: 5}]}>
//               Показать еще
//             </Text>
//           )}
//           {sectionLenght > 10 && (
//             <Text
//               onPress={() => this.loadCrop(index, -1)}
//               style={[styles.translation, {color: 'gray', marginVertical: 5}]}>
//               Свернуть
//             </Text>
//           )}
//         </View>
//       );
//     };
//     const Footer = ({item, index}) => {
//       return (
//         item.length > 0 && (
//           <View key={index}>
//             <Text style={[styles.translationItalic, {marginTop: 20}]}>Формы слова</Text>
//             <View>
//               {item.map((partOfSpeech, index) => {
//                 return (
//                   <View key={index} style={{marginVertical: 10}}>
//                     <Text style={styles.translationSentence}>{partOfSpeech.en_full}</Text>
//                     {partOfSpeech.forms_names.map((form_name, index) => {
//                       return (
//                         <View key={index}>
//                           <StyledText
//                             style={styles.translationSentence}
//                             textStyles={{
//                               i: [
//                                 {
//                                   color: 'gray',
//                                   fontStyle: 'italic',
//                                   fontSize: 16,
//                                 },
//                               ],
//                             }}>
//                             {form_name}
//                           </StyledText>
//                         </View>
//                       );
//                     })}
//                   </View>
//                 );
//               })}
//             </View>
//           </View>
//         )
//       );
//     };

//     const keyExtractor = item => item.id.toString();
//     return (
//       <View style={styles.body}>
//         <Header darkMode={this.props.darkMode} />

//         {this.state.isLoading ? (
//           <ActivityIndicator
//             style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
//             size="large"
//             color="#007AFF"
//           />
//         ) : (
//             <SectionList
//               keyboardDismissMode="on-drag"
//               keyboardShouldPersistTaps="always"
//               sections={this.state.descriptionDataCrop}
//               renderItem={section}
//               renderSectionHeader={({section}) => (
//                 <Text style={[styles.translationItalic, {marginTop: 20}]}>{section.title}</Text>
//               )}
//               renderSectionFooter={sectionFooter}
//               ListHeaderComponent={<Title item={this.state.headerData} />}
//               ListFooterComponent={<Footer item={this.state.footerData} />}
//               keyExtractor={keyExtractor}
//               contentContainerStyle={{flexGrow: 1, paddingVertical: 25, paddingHorizontal: 20}}
//             />
//         )}
//       </View>
//     );
//   }
// }

// export default function ResultEn({darkMode, ...props}) {
//   const route = useRoute();
//   const {word} = route.params;
//   const {id} = route.params;
//   const isFocused = useIsFocused();
//   return <ResultPage {...props} word={word} id={id} darkMode={darkMode} isFocused={isFocused}/>;
// }
