import React, {PureComponent} from 'react';
import {Text, View, Image, Pressable} from 'react-native';
import Header from '../Components/Header';
import {lightStyles} from '../Styles/LightTheme/ResultScreen';
import {darkStyles} from '../Styles/DarkTheme/ResultScreen';
import {openDatabase} from 'react-native-sqlite-storage';
import {ScrollView} from 'react-native-gesture-handler';
import StyledText from 'react-native-styled-text';
import {setData} from '../Components/AddToHistory';
import {useRoute, useIsFocused} from '@react-navigation/native';

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
      isRendered: false,
    };
  }

  componentDidMount() {
    this.setState({
      ruEnWordData: [],
      ruEnDicSectionOne: [],
      ruEnDicSectionTwo: [],
      inDictionary: false,
    });
    this.fetchData(this.props._id, this.props._word);
  }

  componentDidUpdate(prevProps) {
    if (prevProps._word !== this.props._word || prevProps.isFocused !== this.props.isFocused) {
      this.setState({
        ruEnWordData: [],
        ruEnDicSectionOne: [],
        ruEnDicSectionTwo: [],
        inDictionary: false,
      });
      this.fetchData(this.props._id, this.props._word);
    }
  }

  fetchData = async (_id, _word) => {
    var ruEnWordQuery = "SELECT * FROM ru_en_word WHERE word = '" + _word + "'";
    var wordId = 0;
    await db.transaction(async tx => {
      await tx.executeSql(ruEnWordQuery, [], (tx, results) => {
        var temp = [];
        temp.push(results.rows.item(0));
        this.setState({ruEnWordData: temp});
        setData(_word, temp[0].t_inline, _id);
      });
    });

    var ruEnWordDicQuery =
      'SELECT ru_en_word_dic.en_word, ru_en_word_dic.tr, ru_en_word_dic.section, ru_en_word_dic.id, en_ru_word.transcription_us ' +
      'FROM ru_en_word_dic ' +
      'LEFT JOIN en_ru_word ON en_ru_word.word=ru_en_word_dic.en_word ' +
      "WHERE ru_en_word_dic.ru_word_id = '" +
      _id +
      "'" +
      'ORDER BY section, word_order';

    await db.transaction(async tx => {
      await tx.executeSql(ruEnWordDicQuery, [], (tx, results) => {
        let temp = [];

        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        if (temp[temp.length - 1].section == 2) {
          let sectionTwo = [];
          for (let i = temp.length - 1; temp[i].section == 2; --i) {
            sectionTwo.push(temp[i]);
          }
          let sectionOne = temp.slice(0, -sectionTwo.length);
          sectionTwo = sectionTwo.reverse();
          this.setState({
            ruEnDicSectionOne: sectionOne,
            ruEnDicSectionTwo: sectionTwo,
          });
        } else {
          this.setState({
            ruEnDicSectionOne: temp,
          });
        }
      });
    });

    await dbDic.transaction(async tx => {
      await tx.executeSql(
        "SELECT * FROM dictionary WHERE word = '" + _word + "'",
        [],
        (tx, results) => {
          var dictionaryTemp = [];
          dictionaryTemp.push(results.rows.item(0));
          dictionaryTemp[0].word.length > 0 ? this.setState({inDictionary: true}) : null;
        },
      );
    });
  };

  onButtonPress(t_inline) {
    const {_word} = this.props;
    // this.isImageRed(!this.state.inDictionary);
    if (!this.state.inDictionary) {
      dbDic.transaction(tx => {
        tx.executeSql('INSERT OR IGNORE INTO dictionary (word, t_inline) VALUES (?,?)', [
          _word,
          t_inline,
        ]);
      });
    } else {
      dbDic.transaction(tx => {
        tx.executeSql("DELETE FROM dictionary WHERE word = '" + _word + "'", []);
      });
    }
    this.setState({inDictionary: !this.state.inDictionary});
  }

  // isImageRed(inDictionary) {
  //   return;
  // }

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
        <View style={ResultStyles.title}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={ResultStyles.titleWord}>
              {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
            </Text>
            <Text style={ResultStyles.rank}>{item.rank}</Text>
          </View>
          <Pressable
            onPress={() => this.onButtonPress(item.t_inline)}
            android_ripple={ResultStyles.ripple}
            style={ResultStyles.flagButton}>
            <Image source={imgSource} style={ResultStyles.image} />
          </Pressable>
        </View>
        <View style={{marginTop: 10, marginBottom: 20}}>
          <Text style={ResultStyles.translation}>{item.t_inline}</Text>
        </View>
        {item.lemma !== item.word && item.lemma !== ''
          ? this.renderLemma(item.lemma, ResultStyles)
          : null}
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
            <Text>
              {Object.values(itemTr.l).map((word, index) => {
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
            </Text>
            <Text>
              {Object.values(itemTr.w).map((word, index) => {
                return (
                  <View key={index} style={{flexDirection: 'row', flex: 1}}>
                    <StyledText style={ResultStyles.translation}>
                      {index + 1 !== itemTr.w.length ? word + ', ' : word}
                    </StyledText>
                  </View>
                );
              })}
            </Text>
          </Text>
        </View>
      );
    };

    const renderBodySectionOne = this.state.ruEnDicSectionOne.map((item, index) => {
      return (
        <View key={index} style={{flex: 1, flexDirection: 'row'}}>
          <RenderSection item={item} />
        </View>
      );
    });

    const renderBodySectionTwo = this.state.ruEnDicSectionTwo.map((item, index) => {
      return (
        <View key={index} style={{flexDirection: 'row', flex: 1}}>
          <RenderSection item={item} />
        </View>
      );
    });

    return (
      <View style={ResultStyles.body}>
        <Header darkMode={this.props.darkMode} />
        <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
          <View style={[ResultStyles.spacer]}>
            {renderTitle}
            {renderBodySectionOne}
            <View style={{marginTop: 35}}>
              <Text style={ResultStyles.translationItalic}>
                Родственные слова, либо редко употребляемые в данном значении
              </Text>
            </View>
            {renderBodySectionTwo}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default function ResultRu({darkMode, ...props}) {
  const route = useRoute();
  const {word} = route.params;
  const {id} = route.params;
  const isFocused = useIsFocused();

  return <ResultPage {...props} _word={word} _id={id} darkMode={darkMode} isFocused={isFocused} />;
}
