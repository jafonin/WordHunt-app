import {openDatabase} from 'react-native-sqlite-storage';

const dbDic = openDatabase({
  name: 'userdictionary.db', 
  location: 'default'
});


export const setDictionaryData = (
  word,
  id,
  t_inline,
  transcription_us = null,
  transcription_uk = null,
) => {

  return new Promise((resolve, reject) => {
    let en_ru_id = /[A-Za-z]/.test(word) ? 'en_id' : 'ru_id';
    let time = Math.floor(Date.now() / 1000);
    console.log('Adding to dictionary:', {word, id, t_inline, transcription_us, transcription_uk, time, en_ru_id});
    dbDic.transaction(tx => {
      tx.executeSql(
        'INSERT OR IGNORE INTO dictionary (word, t_inline, transcription_us, transcription_uk, time, ' + en_ru_id + ') VALUES (?,?,?,?,?,?)',
        [word, t_inline, transcription_us, transcription_uk, time, id],
        (tx, results) => {
          console.log('word added to dictionary');
          resolve(results);
        },
        (tx, error) => {
          console.error('Error adding word to dictionary:', error?.message || 'Unknown error');
          reject(error);
        }
      );
    });
  });
};

export const deleteDictionaryData = (word, id) => {
  return new Promise((resolve, reject) => {
    dbDic.transaction(tx => {
      tx.executeSql('DELETE FROM dictionary WHERE word = ?', [word],
        (tx, results) => {
          console.log('word deleted from dictionary');
          resolve(results);
        },
        (tx, error) => {
          console.error('Error deleting word from dictionary:', error);
          reject(error);
        }
      );
    });
  });
};

