import React, {PureComponent} from 'react';
import {Text, View, Image, Pressable} from 'react-native';
import Header from '../Components/Header';
import {lightStyles} from '../Styles/LightTheme/ResultScreen';
import {darkStyles} from '../Styles/DarkTheme/ResultScreen';
import {openDatabase} from 'react-native-sqlite-storage';
import {setData} from '../Components/AddToHistory';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native';
import {defaultDark, defaultLight} from '../Styles/Global';
import {SectionList} from 'react-native';

const db = openDatabase({name: 'wordhunt_temp.db', createFromLocation: 1});
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
      inDictionary: false,
      isLoading: true,
    });
    this.fetchData(this.props.id, this.props.word);
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.word !== this.props.word || prevProps.isFocused !== this.props.isFocused) &&
      this.props.isFocused
    ) {
      this.setState({
        inDictionary: false,
        isLoading: true,
      });
      this.fetchData(this.props.id, this.props.word);
    }
  }

  fetchData = async (id, word) => {
    let ruEnWordQuery = "SELECT * FROM ru_en_word WHERE word = '" + word + "'";
    await db.transaction(async tx => {
      await tx.executeSql(ruEnWordQuery, [], (tx, results) => {
        let temp = [];
        temp.push(results.rows.item(0));
        this.setState({ruEnWordData: temp[0]});
        setData(word, id, temp[0].t_inline);
      });
    });
    let ruEnWordDicQuery =
      'SELECT ru_en_word_dic.en_word, ru_en_word_dic.tr, ru_en_word_dic.section, ' +
      'ru_en_word_dic.is_link, ru_en_word_dic.id, en_ru_word.t_inline, en_ru_word.transcription_us, ' +
      "GROUP_CONCAT(en_ru_sentence.original, '~') as original, GROUP_CONCAT(en_ru_sentence.translation, '~') as translation " +
      'FROM ru_en_word_dic ' +
      'LEFT JOIN en_ru_word ON en_ru_word.word=ru_en_word_dic.en_word ' +
      'LEFT JOIN ru_en_word_dic_ex ON ru_en_word_dic.id=ru_en_word_dic_ex.ru_dic_id ' +
      'LEFT JOIN en_ru_sentence ON ru_en_word_dic_ex.ex_id=en_ru_sentence.id ' +
      "WHERE ru_en_word_dic.ru_word_id = '" +
      id +
      "' AND en_ru_word.t_inline NOT NULL " +
      'GROUP BY ru_en_word_dic.id ORDER BY section, word_order';
    await db.transaction(async tx => {
      await tx.executeSql(ruEnWordDicQuery, [], (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
          if (temp[i].translation != null) {
            temp[i].translation = temp[i].translation.split('~');
            temp[i].original = temp[i].original.split('~');
            temp[i].examples = temp[i].translation.map(
              (elem, index) => `${elem} — ${temp[i].original[index]}`,
            );
          }
          delete temp[i].translation;
          delete temp[i].original;
        }
        console.log(temp);

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
  //ДОБАВИТЬ ТАЙМШТАМП
  async onButtonPress(id, t_inline) {
    const {word} = this.props;
    if (!this.state.inDictionary) {
      await dbDic.transaction(async tx => {
        await tx.executeSql(
          'INSERT OR IGNORE INTO dictionary (id, word, t_inline) VALUES (?,?,?)',
          [id, word, t_inline],
        );
      });
    } else {
      await dbDic.transaction(async tx => {
        await tx.executeSql("DELETE FROM dictionary WHERE word = '" + word + "'", []);
      });
    }
    this.setState(prevState => ({inDictionary: !prevState.inDictionary}));
  }

  render() {
    const ResultStyles = this.props.darkMode ? darkStyles : lightStyles;
    const imageSource = this.state.inDictionary
      ? require('../img/pd_11.png')
      : require('../img/pd_00.png');

    const renderLemma = (lemma, ResultStyles) => {
      return (
        <View>
          <Text style={ResultStyles.translation}>Смотрите также: {lemma}</Text>
        </View>
      );
    };

    const RenderTitle = ({item}) => {
      return (
        <View key={item.id}>
          <View style={ResultStyles.title}>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              <Text style={ResultStyles.titleWord}>
                {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
              </Text>
              <Text style={ResultStyles.rank}>{item.rank}</Text>
            </View>
            <Pressable
              onPress={() => this.onButtonPress(item.id, item.t_inline)}
              android_ripple={ResultStyles.ripple}
              style={ResultStyles.flagButton}>
              <Image source={imageSource} style={ResultStyles.image} />
            </Pressable>
          </View>
          <View style={{marginTop: 10, marginBottom: 20}}>
            <Text style={ResultStyles.translation}>{item.t_inline}</Text>
          </View>
          {item.lemma !== item.word && item.lemma !== '' && renderLemma(item.lemma, ResultStyles)}
        </View>
      );
    };

    const renderSection = ({item, index}) => {
      const tInline = item.t_inline.toString();
      return (
        <View style={{marginTop: 15}}>
          <Text>
            <Text style={ResultStyles.positionNumber}>{index + 1 + '  '}</Text>
            <Text style={[ResultStyles.translation, {color: defaultDark.lightBlueFont}]}>
              {item.en_word}
            </Text>
            <Text style={ResultStyles.transcriptionWord}>
              {item.transcription_us ? ' |' + item.transcription_us + '|' + ' — ' : ' — '}
            </Text>
            <Text style={ResultStyles.translation}>{tInline}</Text>
          </Text>
          {item.examples &&
            item.examples.map((example, index) => (
              <View key={index} style={{flexDirection: 'row'}}>
                <Text style={{width: 10}}></Text>
                <Text>
                  <Text style={ResultStyles.translationSentence}>{example}</Text>
                </Text>
              </View>
            ))}
        </View>
      );
    };

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
          <View style={ResultStyles.spacer}>
            <SectionList
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
              sections={[
                {title: '', data: this.state.ruEnDicSectionOne},
                {
                  title:
                    this.state.ruEnDicSectionTwo.length > 0
                      ? 'Родственные слова, либо редко употребляемые в данном значении'
                      : '',
                  data: this.state.ruEnDicSectionTwo,
                },
              ]}
              renderItem={renderSection}
              renderSectionHeader={({section}) =>
                section.title.length > 0 ? (
                  <Text style={[ResultStyles.translationItalic, {marginTop: 35}]}>
                    {section.title}
                  </Text>
                ) : null
              }
              ListHeaderComponent={<RenderTitle item={this.state.ruEnWordData} />}
              keyExtractor={(item, index) => item.id}
              contentContainerStyle={{paddingVertical: 25, paddingHorizontal: 20}}
            />
          </View>
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
