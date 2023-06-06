import {openDatabase} from 'react-native-sqlite-storage';

const dbDic = openDatabase({name: 'UserDictionary.db', createFromLocation: 1});

export const setDictionaryData = async (
  word,
  id,
  t_inline,
  transcription_us = null,
  transcription_uk = null,
) => {
  let en_ru_id = /[A-Za-z]/.test(word) ? 'en_id' : 'ru_id';
  let time = Math.floor(Date.now() / 1000);
  await dbDic.transaction(async tx => {
    await tx.executeSql(
      'INSERT OR IGNORE INTO dictionary (' +
        en_ru_id +
        ', word, t_inline, transcription_us, transcription_uk, time) VALUES (?,?,?,?,?,?)',
      [id, word, t_inline, transcription_us, transcription_uk, time],
    );
  });
};

export const deleteDictionaryData = async (word, id) => {
  let en_ru_id = /[A-Za-z]/.test(word) ? 'en_id' : 'ru_id';
  await dbDic.transaction(async tx => {
    await tx.executeSql('DELETE FROM dictionary WHERE ' + en_ru_id + " = '" + id + "'", []);
  });
};
