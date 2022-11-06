import React, {Component} from 'react';
import {Text, View, Image, Pressable} from 'react-native';
import Header from '../Components/Header';
import {ResultStyles} from '../Styles/ResultScreen';
import {openDatabase} from 'react-native-sqlite-storage';
import {ScrollView} from 'react-native-gesture-handler';
import StyledText from 'react-native-styled-text';

const db = openDatabase({name: 'ru_en_word.db', createFromLocation: 1});
const dbDic = openDatabase({name: 'UserDictionary.db', createFromLocation: 1});

class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ruEnWordData: [],
      ruEnDicSectionOne: [],
      ruEnDicSectionTwo: [],
      inDictionary: false,
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
    if (prevProps._word !== this.props._word) {
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
    var ruEnWordQuery = "SELECT * FROM ru_en_word WHERE id = '" + _id + "'";
    await db.transaction(async tx => {
      await tx.executeSql(ruEnWordQuery, [], (tx, results) => {
        var temp = [];
        temp.push(results.rows.item(0));
        this.setState({ruEnWordData: temp});
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
        var temp = [];
        var sectionTwo = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        for (let i = temp.length - 1; temp[i].section == 2; --i) {
          sectionTwo.push(temp[i]);
        }
        var sectionOne = temp.slice(0, -sectionTwo.length);
        var sectionTwo = sectionTwo.reverse();
        // var data = [
        //   {title: '', data: sectionOne},
        //   {
        //     title: 'Родственные слова, либо редко употребляемые в данном значении',
        //     data: sectionTwo,
        //   },
        // ];
        // console.log(data);
        this.setState({
          ruEnDicSectionOne: sectionOne,
          ruEnDicSectionTwo: sectionTwo,
        });
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

  updateDictionary(queryUpdate, t_inline) {
    const {_word} = this.props;
    dbDic.transaction(tx => {
      tx.executeSql(queryUpdate, [_word, t_inline]);
    });
  }

  onButtonPress(t_inline) {
    const {_word} = this.props;
    this.setState({inDictionary: !this.state.inDictionary});
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
  }

  renderLemma(lemma, word) {
    if (lemma !== word && lemma !== '') {
      return (
        <View>
          <Text style={ResultStyles.wd_translation_text}>Смотрите также: {lemma}</Text>
        </View>
      );
    }
  }

  render() {
    const renderTitle = this.state.ruEnWordData.map(item => (
      <View key={item.id}>
        <View style={ResultStyles.wd_title}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={ResultStyles.wd_title_text}>
              {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
            </Text>
            <Text style={ResultStyles.rank}>{item.rank}</Text>
          </View>
          <Pressable
            onPress={() => this.onButtonPress(item.t_inline)}
            style={{
              height: 35,
              width: 35,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.state.inDictionary == false && (
              <Image source={require('../img/pd_00.png')} style={ResultStyles.img} />
            )}
            {this.state.inDictionary == true && (
              <Image source={require('../img/pd_11.png')} style={ResultStyles.img} />
            )}
          </Pressable>
        </View>
        <View style={ResultStyles.wd_translation}>
          <Text style={ResultStyles.wd_translation_text}>{item.t_inline}</Text>
        </View>
        {this.renderLemma(item.lemma, item.word)}
      </View>
    ));

    const RenderSection = ({item}) => {
      const itemTr = JSON.parse(item.tr).lw[0];
      return (
        <View style={{marginVertical: 7, flex: 1}}>
          <Text>
            <Pressable>
              <Text>
                <Text style={ResultStyles.wd_translation_text}>{item.en_word + ' '}</Text>
                {item.transcription_us ? (
                  <Text style={ResultStyles.wd_translation_text}>
                    {'|' + item.transcription_us + '|' + ' — '}
                  </Text>
                ) : (
                  <Text style={ResultStyles.wd_translation_text}>{' — '}</Text>
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
                          style={[
                            ResultStyles.wd_translation_text,
                            {textDecorationLine: 'underline'},
                          ]}>
                          {index + 1 !== _length || _length !== 0 ? word : word}
                        </StyledText>
                        <Text style={ResultStyles.wd_translation_text}>
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
                    <StyledText style={ResultStyles.wd_translation_text}>
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
      <View style={{flex: 1}}>
        <Header />
        <ScrollView>
          <View style={[ResultStyles.wd, {flex: 1}]}>
            {renderTitle}
            {renderBodySectionOne}
            <View style={{marginTop: 35}}>
              <Text style={ResultStyles.wd_translation_text_i}>
                Родственные слова, либо редко употребляемые в данном значении
              </Text>
            </View>
            {renderBodySectionTwo}
          </View>
        </ScrollView>
        {/* <View style={[ResultStyles.wd, {flex: 1}]}>
          {renderTitle}
          <SectionList
            sections={this.sectionData}
            keyExtractor={(item, index) => item + index}
            renderItem={renderSection}
            renderSectionHeader={({section: {title}}) => (
              <Text style={{color: '#000'}}>{title}</Text>
            )}
          />
        </View> */}
        {/* <FlatList
              contentContainerStyle={{flexGrow: 1}}
              data={this.state.ruEnWordDicData}
              keyExtractor={item => item.id}
              renderItem={renderBodySectionOne}
              style={{marginVertical: 7}}
              windowSize={5}
            /> */}
      </View>
    );
  }
}

export default function ResultRu({route, props}) {
  const {word} = route.params;
  const {id} = route.params;
  return <ResultPage {...props} _word={word} _id={id} />;
}
