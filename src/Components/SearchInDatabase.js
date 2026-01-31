// import React from 'react';
// import {useState} from 'react';
// import {View, Text} from 'react-native';
// import {openDatabase} from 'react-native-sqlite-storage';

// const db = openDatabase({name: 'wordhunt_temp.db', createFromLocation: 1});

// export default async function SearchInDatabase(searchValue) {
//   const [goTo, setGoTo] = useState('');
//   if (searchValue) {
//     if (/[A-Za-z]/.test(searchValue)) {
//       var query =
//         'SELECT id, word, t_inline, transcription_us, transcription_uk ' +
//         "FROM en_ru_word WHERE t_inline IS NOT NULL AND word LIKE '" +
//         searchValue.toLowerCase() +
//         "%' ORDER BY rank LIMIT 10";
//       setGoTo = 'ResultEn';
//       //   this.setState({goTo: 'ResultEn'});
//     } else {
//       var query =
//         "SELECT id, word, t_inline, lemma FROM ru_en_word WHERE t_inline IS NOT '' AND word LIKE '" +
//         searchValue.toLowerCase() +
//         "%' ORDER BY id LIMIT 10";
//       setGoTo = 'ResultRu';
//       //   this.setState({goTo: 'ResultRu'});
//     }
//     try {
//       await db.transaction(async tx => {
//         await tx.executeSql(query, [], (tx, results) => {
//           let temp = [];
//           for (let i = 0; i < results.rows.length; ++i) {
//             temp.push(results.rows.item(i));
//           }
//           this.setState({data: temp});
//         }),
//           function (tx, err) {
//             alert('not found');
//           };
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   return goTo;
// }
