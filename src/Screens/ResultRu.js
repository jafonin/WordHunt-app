import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  Pressable,
  Image,
} from 'react-native';
import {useRoute, useIsFocused} from '@react-navigation/native';
import StyledText from 'react-native-styled-text';

import Header from '../Components/Header';
import { getRuWordDetails } from '../Services/Database';
import { deleteDictionaryData, setDictionaryData } from '../Components/AddToDictionary';

import { lightStyles } from '../Styles/LightTheme/ResultScreen';
import { darkStyles } from '../Styles/DarkTheme/ResultScreen';
import { defaultDark } from '../Styles/Global';


const ResultRu = ({darkMode}) => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const {word, id} = route.params;

  const [state, setState] = useState({
    main: null,
    s1: [],
    s2: [],
    inDic: false,
    loading: true,
  });

  const styles = darkMode ? darkStyles : lightStyles;

  useEffect(() => {
    let isMounted = true;

    if (isFocused) {
      setState(prev => ({...prev, loading: true}));

      getRuWordDetails(id, word).then((data) => {
        if (!isMounted) return;

        const processedList = data.dictionary.map((item) => {
          let newItem = {...item};
          if (newItem.translation != null) {
            newItem.translation = newItem.translation.split('~');
            newItem.original = newItem.original.split('~');
            newItem.examples = newItem.translation.map(
              (elem, index) => `${elem} — ${newItem.original[index]}`,
            );
          }
          return newItem;
        });

        setState({
          main: data.main,
          s1: processedList.filter(i => i.section === 1),
          s2: processedList.filter(i => i.section === 2),
          inDic: data.inDictionary,
          loading: false,
        });
      }).catch((error) => {
          console.error("Error updating state:", error);
          if (isMounted) setState(prev => ({...prev, loading: false}));
        });
      }

      return () => {
        isMounted = false;
      };
      }, [id, word, isFocused]);

  const handleDictionaryPress = () => {
    if (!state.main) return;
    if (!state.inDic) {
      setDictionaryData(word, id, state.main.t_inline);
    } else {
      deleteDictionaryData(word, id);
    }
    setState(prev => ({...prev, inDic: !prev.inDic}));
  };

  const renderLemma = (lemma) => (
    <View>
      <Text style={styles.translation}>Смотрите также: {lemma}</Text>
    </View>
  );

  const renderTitle = () => {
    if (!state.main) return null;
    const item = state.main;
    const imageSource = state.inDic
      ? require('../../android/app/src/main/assets/img/pd_11.png')
      : require('../../android/app/src/main/assets/img/pd_00.png');

    return (
      <View key={item.id}>
        <View style={styles.title}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <Text style={styles.titleWord}>
              {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
            </Text>
            <Text style={styles.rank}>{item.rank}</Text>
          </View>
          <Pressable
            onPress={handleDictionaryPress}
            android_ripple={styles.ripple}
            style={styles.flagButton}>
            <Image source={imageSource} style={styles.image} />
          </Pressable>
        </View>
        <View style={{marginTop: 10, marginBottom: 20}}>
          <Text style={styles.translation}>{item.t_inline}</Text>
        </View>
        {item.lemma !== item.word && item.lemma && renderLemma(item.lemma)}
      </View>
    );
  };

  const renderSectionItem = ({item, index}) => {
    const tInline = item.t_inline ? item.t_inline.toString() : '';
    
    return (
      <View style={{marginTop: 15}}>
        <Text>
          <Text style={styles.positionNumber}>{index + 1 + '  '}</Text>
          <Text style={[styles.translation, {color: defaultDark.lightBlueFont}]}>
            {item.en_word}
          </Text>
          <Text style={styles.transcriptionWord}>
            {item.transcription_us ? ' |' + item.transcription_us + '|' + ' — ' : ' — '}
          </Text>
          <Text style={styles.translation}>{tInline}</Text>
        </Text>
        {item.examples &&
          item.examples.map((example, idx) => (
            <View key={idx} style={{flexDirection: 'row'}}>
              <View style={{width: 10}} />
              <Text style={{flex: 1}}>
                <Text style={styles.translationSentence}>{example}</Text>
              </Text>
            </View>
          ))}
      </View>
    );
  };

  return (
    <View style={styles.body}>
      <Header darkMode={darkMode} />
      {state.loading ? (
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
            sections={[
              {title: '', data: state.s1},
              {
                title:
                  state.s2.length > 0
                    ? 'Родственные слова, либо редко употребляемые в данном значении'
                    : '',
                data: state.s2,
              },
            ]}
            renderItem={renderSectionItem}
            renderSectionHeader={({section}) =>
              section.title.length > 0 ? (
                <Text style={[styles.translationItalic, {marginTop: 35}]}>{section.title}</Text>
              ) : null
            }
            ListHeaderComponent={renderTitle}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{paddingVertical: 25, paddingHorizontal: 20}}
          />
        </View>
      )}
    </View>
  );
};

export default ResultRu;