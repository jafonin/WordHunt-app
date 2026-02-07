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
import {lightStyles} from '../Styles/LightTheme/ResultScreen';
import {darkStyles} from '../Styles/DarkTheme/ResultScreen';

import { getWordFullDetails, saveToHistory, toggleDictionary } from '../Services/Database';

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
          saveToHistory(word, id, data.header.t_inline, data.header.transcription_us);
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

  const handleDictionaryPress = async () => {
    if (!headerData) return;
    try {
      const isNowInDictionary = await toggleDictionary(word, id, headerData.t_inline, headerData.transcription_us, headerData.transcription_uk);
      setInDictionary(isNowInDictionary);
    } catch (error) {
      console.error("Error toggling dictionary status:", error);
    }
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
