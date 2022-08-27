import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import Header from '../Components/Header';
import {ResultStyles} from '../Styles/ResultScreen';
import {openDatabase} from 'react-native-sqlite-storage';
import {ScrollView} from 'react-native-gesture-handler';
import StyledText from 'react-native-styled-text';

const db = openDatabase({name: 'en_ru_word.db', createFromLocation: 1});

class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentDidMount() {
    this.setState({data: []});
    this.fetchData(this.props._word);
  }

  componentDidUpdate(prevProps) {
    if (prevProps._word !== this.props._word) {
      this.fetchData(this.props._word);
      this.setState({data: []});
    }
  }

  fetchData(_word) {
    // const { word } = this.props;
    var query = "SELECT * FROM en_ru_word WHERE word = '" + _word + "'";
    db.transaction(tx => {
      tx.executeSql(query, [], (tx, results) => {
        var temp = [];
        temp.push(results.rows.item(0));
        this.setState({data: temp});
      });
    });
  }

  render() {
    const renderPage = this.state.data.map(item => (
      <ScrollView key={item.id}>
        <View style={ResultStyles.wd}>
          <View style={ResultStyles.wd_title}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={ResultStyles.wd_title_text}>
                {item.word.charAt(0).toUpperCase() + item.word.slice(1)}
              </Text>
              <Text style={ResultStyles.rank}>{item.rank}</Text>
            </View>
            <Image
              source={require('../img/pd_11.png')}
              style={ResultStyles.img}
            />
          </View>
          <View style={ResultStyles.wd_transcription}>
            <View>
              <Text style={ResultStyles.wd_transcription_text_i}>амер.</Text>
              <Text style={ResultStyles.wd_transcription_text_i}>брит.</Text>
            </View>
            <View>
              <Text style={ResultStyles.wd_transcription_text}>
                |{item.transcription_us}|
              </Text>
              <Text style={ResultStyles.wd_transcription_text}>
                |{item.transcription_uk}|
              </Text>
            </View>
          </View>
          <View style={ResultStyles.wd_translation}>
            <Text style={ResultStyles.wd_translation_text}>
              {item.t_inline}
            </Text>
          </View>
          <View>
            {Object.values(JSON.parse(item.t_mix)).map((word, index) => {
              return (
                <View key={index}>
                  {Object.values(word).map((translation, index) => {
                    return (
                      <View key={index} style={ResultStyles.wd_translation}>
                        <StyledText style={ResultStyles.wd_translation_text_i}>
                          {translation.w}
                        </StyledText>
                        <StyledText style={ResultStyles.wd_translation_text}>
                          {'- ' + translation.t.join('\n\n- ')}
                        </StyledText>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    ));
    return (
      <View style={{flex: 1}}>
        <Header />
        {renderPage}
      </View>
    );
  }
}

export default function ResultEn({route, props}) {
  const {word} = route.params;
  return <ResultPage {...props} _word={word} />;
}
