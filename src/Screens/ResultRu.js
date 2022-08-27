import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import Header from '../Components/Header';
import {ResultStyles} from '../Styles/ResultScreen';
import {openDatabase} from 'react-native-sqlite-storage';
import {ScrollView} from 'react-native-gesture-handler';

const db = openDatabase({name: 'ru_en_word.db', createFromLocation: 1});

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
    var query = "SELECT * FROM ru_en_word WHERE word = '" + _word + "'";
    db.transaction(tx => {
      tx.executeSql(query, [], (tx, results) => {
        var temp = [];
        temp.push(results.rows.item(0));
        this.setState({data: temp});
      });
    });
  }

  renderLemma(lemma, word) {
    if (lemma != word) {
      return (
        <View>
          <Text style={ResultStyles.wd_translation_text}>Смотрите также: {lemma}</Text>
        </View>
      );
    }
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
          <View style={ResultStyles.wd_translation}>
            <Text style={ResultStyles.wd_translation_text}>
              {item.t_inline}
            </Text>
          </View>
          
            {this.renderLemma(item.lemma, item.word)}
          
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

export default function ResultRu({route, props}) {
  const {word} = route.params;
  // const word = 'Hello';
  return <ResultPage {...props} _word={word} />;
}
