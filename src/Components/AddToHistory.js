import {openDatabase} from 'react-native-sqlite-storage';

const dbHistory = openDatabase({name: 'UserHistory.db', createFromLocation: 1});

export const setData = async (
  word,
  id,
  t_inline = null,
  transcription_us = null,
  transcription_uk = null,
) => {
  let en_ru_id = /[A-Za-z]/.test(word) ? 'en_id' : 'ru_id';
  debugger;
  try {
    await dbHistory.transaction(async tx => {
      await tx.executeSql(
        "UPDATE History SET time = '" +
          Math.floor(Date.now() / 1000) +
          "' WHERE word = '" +
          word.toLowerCase() +
          "'",
        // console.log('updated: ' + {word}),
      ),
        await tx.executeSql(
          'INSERT OR IGNORE INTO History (word, t_inline, ' +
            en_ru_id +
            ', transcription_us, transcription_uk) VALUES (?,?,?,?,?)',
          [word, t_inline, id, transcription_us, transcription_uk],
          // console.log('insert: ' + {word}),
        );
    });
  } catch (error) {
    console.log(error);
  }
};
