import React, {PureComponent} from 'react';
import {Text, View, Image, Pressable, Keyboard} from 'react-native';
import Header from '../Components/Header';
import {lightStyles} from '../Styles/LightTheme/ResultScreen';
import {darkStyles} from '../Styles/DarkTheme/ResultScreen';
import {openDatabase} from 'react-native-sqlite-storage';
import {ScrollView} from 'react-native-gesture-handler';
import StyledText from 'react-native-styled-text';
import {setData} from '../Components/AddToHistory';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native';

const db = openDatabase({name: 'ru_en_word.db', createFromLocation: 1});
const dbDic = openDatabase({name: 'UserDictionary.db', createFromLocation: 1});

class ResultPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ruEnWordData: [],
      ruEnDicSectionOne: [],
      ruEnDicSectionTwo: [],
      inDictionary: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.setState({
      // ruEnWordData: [],
      // ruEnDicSectionOne: [],
      // ruEnDicSectionTwo: [],
      inDictionary: false,
      // isLoading: true,
    });
    this.fetchData(this.props.id, this.props.word);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.word !== this.props.word || prevProps.isFocused !== this.props.isFocused) {
      this.setState({
        // ruEnWordData: [],
        // ruEnDicSectionOne: [],
        // ruEnDicSectionTwo: [],
        inDictionary: false,
        isLoading: true,
      });
      this.fetchData(this.props.id, this.props.word);
    }
  }

  fetchData = async (id, word) => {
    let ruEnWordQuery = "SELECT * FROM ru_en_word WHERE word = '" + word + "'";
    // var wordId = 0;
    await db.transaction(async tx => {
      await tx.executeSql(ruEnWordQuery, [], (tx, results) => {
        let temp = [];
        temp.push(results.rows.item(0));
        this.setState({ruEnWordData: temp});
        setData(word, temp[0].t_inline, id);
      });
    });

    let ruEnWordDicQuery =
      'SELECT ru_en_word_dic.en_word, ru_en_word_dic.tr, ru_en_word_dic.section, ru_en_word_dic.id, en_ru_word.transcription_us ' +
      'FROM ru_en_word_dic ' +
      'LEFT JOIN en_ru_word ON en_ru_word.word=ru_en_word_dic.en_word ' +
      "WHERE ru_en_word_dic.ru_word_id = '" +
      id +
      "' ORDER BY section, word_order";

    await db.transaction(async tx => {
      await tx.executeSql(ruEnWordDicQuery, [], (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        let sectionOne = temp.filter(item => item.section === 1);
        let sectionTwo = temp.filter(item => item.section === 2);
        this.setState({
          ruEnDicSectionOne: sectionOne,
          ruEnDicSectionTwo: sectionTwo,
          isLoading: false,
        });
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

  onButtonPress(id, t_inline) {
    const {word} = this.props;
    if (!this.state.inDictionary) {
      dbDic.transaction(tx => {
        tx.executeSql('INSERT OR IGNORE INTO dictionary (id, word, t_inline) VALUES (?,?,?)', [
          id,
          word,
          t_inline,
        ]);
      });
    } else {
      dbDic.transaction(tx => {
        tx.executeSql("DELETE FROM dictionary WHERE word = '" + word + "'", []);
      });
    }
    this.setState({inDictionary: !this.state.inDictionary});
  }

  renderLemma(lemma, ResultStyles) {
    return (
      <View>
        <Text style={ResultStyles.translation}>Смотрите также: {lemma}</Text>
      </View>
    );
  }

  render() {
    const ResultStyles = this.props.darkMode ? darkStyles : lightStyles;
    const imgSource = this.state.inDictionary
      ? require('../img/pd_11.png')
      : require('../img/pd_00.png');

    const renderTitle = this.state.ruEnWordData.map(item => (
      <View key={item.id}>
        {/* {this.setState({isLoading: true})} */}
        <View style={ResultStyles.title}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={ResultStyles.titleWord}>
              {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
            </Text>
            <Text style={ResultStyles.rank}>{item.rank}</Text>
          </View>
          <Pressable
            onPress={() => this.onButtonPress(item.id, item.t_inline)}
            android_ripple={ResultStyles.ripple}
            style={ResultStyles.flagButton}>
            <Image source={imgSource} style={ResultStyles.image} />
          </Pressable>
        </View>
        <View style={{marginTop: 10, marginBottom: 20}}>
          <Text style={ResultStyles.translation}>{item.t_inline}</Text>
        </View>
        {item.lemma !== item.word &&
          item.lemma !== '' &&
          this.renderLemma(item.lemma, ResultStyles)}
      </View>
    ));

    const RenderSection = ({item}) => {
      const itemTr = JSON.parse(item.tr).lw[0];
      return (
        <View style={{marginVertical: 7, flex: 1}}>
          <Text>
            <Pressable>
              <Text>
                <Text style={ResultStyles.translation}>{'- ' + item.en_word + ' '}</Text>
                {item.transcription_us ? (
                  <Text style={ResultStyles.translation}>
                    {'|' + item.transcription_us + '|' + ' — '}
                  </Text>
                ) : (
                  <Text style={ResultStyles.translation}>{' — '}</Text>
                )}
              </Text>
            </Pressable>
            {itemTr.l.map((word, index) => {
              const _length = itemTr.l.length;
              return (
                <View key={index} style={{flexDirection: 'row', flex: 1}}>
                  <Pressable>
                    <Text>
                      <StyledText
                        style={[ResultStyles.translation, {textDecorationLine: 'underline'}]}>
                        {index + 1 !== _length || _length !== 0 ? word : word}
                      </StyledText>
                      <Text style={ResultStyles.translation}>
                        {index + 1 !== _length || (_length !== 0 && itemTr.w.length) ? ', ' : ''}
                      </Text>
                    </Text>
                  </Pressable>
                </View>
              );
            })}
            {itemTr.w.map((word, index) => {
              return (
                <View key={index} style={{flexDirection: 'row', flex: 1}}>
                  <StyledText style={ResultStyles.translation}>
                    {index + 1 !== itemTr.w.length ? word + ', ' : word}
                  </StyledText>
                </View>
              );
            })}
          </Text>
        </View>
      );
    };

    const renderBodySectionOne = this.state.ruEnDicSectionOne.map((item, index) => {
      return (
        <View key={`${item.id}-${index}`} style={{flex: 1, flexDirection: 'row'}}>
          <RenderSection item={item} />
          {/* {this.setState({isLoading: false})} */}
        </View>
      );
    });

    const renderBodySectionTwo = this.state.ruEnDicSectionTwo.map((item, index) => {
      return (
        <View key={`${item.id}-${index}`} style={{flexDirection: 'row', flex: 1}}>
          <RenderSection item={item} />
        </View>
      );
    });
    return (
      <View style={ResultStyles.body}>
        <Header darkMode={this.props.darkMode} />
        {this.state.isLoading ? (
          <ActivityIndicator
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            size="large"
            color="#007AFF"
          />
        ) : (
          <ScrollView
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            style={{flex: 1}}>
            <View style={[ResultStyles.spacer]}>
              {renderTitle}
              {renderBodySectionOne}
              {this.state.ruEnDicSectionTwo.length > 0 && (
                <View style={{marginTop: 35}}>
                  <Text style={ResultStyles.translationItalic}>
                    Родственные слова, либо редко употребляемые в данном значении
                  </Text>
                </View>
              )}
              {renderBodySectionTwo}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

export default function ResultRu({darkMode, ...props}) {
  const route = useRoute();
  const {word} = route.params;
  const {id} = route.params;
  const isFocused = useIsFocused();
  return <ResultPage {...props} word={word} id={id} darkMode={darkMode} isFocused={isFocused} />;
}
