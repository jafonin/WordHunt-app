import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Header from '../Components/Header';
import { ResultStyles } from '../Styles/ResultScreen';
import { openDatabase } from 'react-native-sqlite-storage';


const db = openDatabase({name: 'en_ru_word.db', createFromLocation: 1});

class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    const { word } = this.props;
    // console.log(word);
    this.fetchData(word);
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.word !== this.props.word) {
      const { word } = this.props;
      // console.log(word);
      this.fetchData(word);
    }

    // this.setState({_word: word})

    // await this.fetchData(word);
  }
  // async handleSearch() {
  //   // this.setState({searchValue: text});
  //   console.log(word);
  //   await this.fetchData(text);
  // }

  fetchData() {
    const { word } = this.props;
    
    var query = "SELECT * FROM en_ru_word WHERE word = '" + word + "'";
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        var temp = [];          
        temp.push(results.rows.item(0));        
        this.setState({ data: temp });
        console.log(results.rows.item(0));
      })   
    })
  }

  render() {
    const { word } = this.props;
    return(
      <View>
        <Header />
        <View style={ResultStyles.wd}>
          <View style={ResultStyles.wd_title}>
            <Text style={{color: '#213646', fontSize: 20, fontFamily: 'Open Sans'}}>
                {word.charAt(0).toUpperCase() + word.slice(1)}
            </Text>
          </View>
        </View>
    </View>
    )
  }
};




export default function Result({route, props}) {
  const { word } = route.params;
  // const word = 'Hello';
  return <ResultPage {...props} word={word}/>;
};