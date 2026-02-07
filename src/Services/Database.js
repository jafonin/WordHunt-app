import { openDatabase, enablePromise } from 'react-native-sqlite-storage';

enablePromise(true);

const db = openDatabase({ name: 'wordhunt.db', createFromLocation: "~wordhunt.db", location: 'default' });
const dbDic = openDatabase({ name: 'userdictionary.db', location: 'default' });
const dbHistory = openDatabase({ name: 'userhistory.db', location: 'default' });

export const initUserDatabases = async () => {
  const dics = await dbDic;
  const hist = await dbHistory;

  await dics.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS dictionary (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        word TEXT UNIQUE, 
        t_inline TEXT, 
        transcription_us TEXT, 
        transcription_uk TEXT, 
        time INTEGER, 
        ru_id INTEGER, 
        en_id INTEGER
      );`
    );
  });

  await hist.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS History (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        word TEXT UNIQUE, 
        t_inline TEXT, 
        transcription_us TEXT, 
        transcription_uk TEXT, 
        time INTEGER, 
        ru_id INTEGER, 
        en_id INTEGER
      );`
    );
  });
  console.log("Databases initialized with 'time' column");
};

export const searchWordsInDb = async (searchText) => {
  if (!searchText || searchText.trim() === '') return [];
  const isEnglish = /[A-Za-z]/.test(searchText);
  const table = isEnglish ? 'en_ru_word' : 'ru_en_word';
  const orderBy = isEnglish ? 'rank' : 'id';
  const condition = isEnglish ? "t_inline IS NOT NULL" : "t_inline IS NOT ''";
  const query = `
    SELECT id, word, t_inline 
    FROM ${table} 
    WHERE ${condition} AND word LIKE ? 
    ORDER BY ${orderBy} 
    LIMIT 10
  `;
  
  // const params = [`${searchText.toLowerCase()}%`];
  const [results] = await (await db).executeSql(query, [`${searchText.toLowerCase()}%`]);

  let words = [];
  for (let i = 0; i < results.rows.length; i++) words.push(results.rows.item(i));
  return words;
};

export const getWordFullDetails = async (id, word) => {
    const mainDB = await db;
    const dicDb = await dbDic;
    const result = {
        header: null,
        sentences: [],
        forms: [],
        inDictionary: false
    };

    const headerQuery = `
        SELECT 
            en_ru_word.id, 
            en_ru_word.rank, 
            en_ru_word.word, 
            en_ru_word.t_inline, 
            en_ru_word.transcription_us, 
            en_ru_word.transcription_uk,
            en_ru_word.sound_us, 
            en_ru_word.sound_uk,
            en_ru_word_dic_word_forms_passive.form, 
            en_ru_word_dic_word_forms_names.name, 
            en_ru_word_dic_word_forms_names.name_str
        FROM en_ru_word 
        LEFT JOIN en_ru_word_dic_word_forms_passive ON en_ru_word.id = en_ru_word_dic_word_forms_passive.word_id
        LEFT JOIN en_ru_word_dic_word_forms_names ON en_ru_word_dic_word_forms_passive.name_id = en_ru_word_dic_word_forms_names.id
        WHERE en_ru_word.id = ?
    `;

    const sentencesQuery = `
        SELECT tech_part_of_speach.ru_full, en_ru_word_dic_tr.id, en_ru_word_dic_tr.variant, 
            GROUP_CONCAT(en_ru_sentence.original, '~') as original, 
            GROUP_CONCAT(en_ru_sentence.translation, '~') as translation 
        FROM en_ru_word_dic_pos 
        LEFT JOIN tech_part_of_speach ON en_ru_word_dic_pos.pos_code=tech_part_of_speach.code 
        LEFT JOIN en_ru_word_dic_tr ON en_ru_word_dic_pos.id=en_ru_word_dic_tr.pos_id 
        LEFT JOIN en_ru_word_dic_tr_ex ON en_ru_word_dic_tr.id=en_ru_word_dic_tr_ex.tr_id 
        LEFT JOIN en_ru_sentence ON en_ru_word_dic_tr_ex.ex_id=en_ru_sentence.id 
        WHERE en_ru_word_dic_pos.word_id = ? 
        GROUP BY en_ru_word_dic_tr.id 
        ORDER BY en_ru_word_dic_pos.pos_order, en_ru_word_dic_tr.tr_order
    `;

    const formsQuery = `
        SELECT GROUP_CONCAT(en_ru_word_dic_word_forms_names.name_str, '~') as name_str, 
            GROUP_CONCAT(en_ru_word_dic_word_forms.form, '~') as form, 
            tech_part_of_speach.en_full 
        FROM en_ru_word_dic_word_forms 
        LEFT JOIN en_ru_word_dic_word_forms_names ON en_ru_word_dic_word_forms.name_id=en_ru_word_dic_word_forms_names.id 
        LEFT JOIN tech_part_of_speach ON en_ru_word_dic_word_forms.pos_code=tech_part_of_speach.code 
        WHERE en_ru_word_dic_word_forms.word_id = ? 
        GROUP BY tech_part_of_speach.en_full 
        ORDER BY tech_part_of_speach.code DESC
    `;

    await mainDB.transaction(tx => {
        tx.executeSql(headerQuery, [id], (_, res) => {
            if (res.rows.length > 0) {
                result.header = res.rows.item(0);
            }
        });
        tx.executeSql(sentencesQuery, [id], (_, res) => {
            for (let i = 0; i < res.rows.length; i++) {
                result.sentences.push(res.rows.item(i));
            }
        });
        tx.executeSql(formsQuery, [id], (_, res) => {
            for (let i = 0; i < res.rows.length; i++) {
                result.forms.push(res.rows.item(i));
            }
        });
    });

    const [dicRes] = await dicDb.executeSql("SELECT id FROM dictionary WHERE word = ?", [word]);
    if (dicRes.rows.length > 0) result.inDictionary = true;
    return result;
};

export const saveToHistory = async (word, id, t_inline, transcription_us = null, transcription_uk = null) => {
  const histDB = await dbHistory;
  let time = Math.floor(Date.now() / 1000);
  let en_ru_id = /[A-Za-z]/.test(word) ? 'en_id' : 'ru_id';
  let lowWord = word.toLowerCase();

  try {
    await histDB.transaction(tx => {
      tx.executeSql(
        "UPDATE History SET time = ? WHERE word = ?",
        [time, lowWord]);
      tx.executeSql(
        'INSERT OR IGNORE INTO History (word, t_inline, ' +
          en_ru_id +
          ', time, transcription_us, transcription_uk) VALUES (?,?,?,?,?,?)',
        [lowWord, t_inline, id, time, transcription_us, transcription_uk]
      );
    });
  } catch (error) {
    console.error('Error saving to history:', error);
  }
};

export const getHistory = async () => {
  const [results] = await (await dbHistory).executeSql('SELECT * FROM History ORDER BY time DESC');
  let list = [];
  for (let i = 0; i < results.rows.length; i++) list.push(results.rows.item(i));
  return list;
};

export const toggleDictionary = async (word, id, t_inline, transcription_us = null, transcription_uk = null) => {
  const dicDB = await dbDic;
  let en_ru_id = /[A-Za-z]/.test(word) ? 'en_id' : 'ru_id';
  let time = Math.floor(Date.now() / 1000);
  let lowWord = word.toLowerCase();
  const [res] = await dicDB.executeSql("SELECT id FROM dictionary WHERE word = ?", [lowWord]);

  if (res.rows.length > 0) {
    await dicDB.executeSql('DELETE FROM dictionary WHERE word = ?', [lowWord]);
    return false;
  } else {
    await dicDB.executeSql(
      `INSERT OR IGNORE INTO dictionary (word, t_inline, transcription_us, transcription_uk, time, ${en_ru_id}) VALUES (?,?,?,?,?,?)`,
      [lowWord, t_inline, transcription_us, transcription_uk, time, id]
    );
    return true;
  }
};

export const getDictionary = async () => {
  const [results] = await (await dbDic).executeSql('SELECT * FROM dictionary ORDER BY time DESC');
  let list = [];
  for (let i = 0; i < results.rows.length; i++) list.push(results.rows.item(i));
  return list;
};

export const getRuWordDetails = async (id, word) => {
  const mainDb = await db;
  const dicDb = await dbDic;
  const result = { main: null, dictionary: [], inDictionary: false };

  try {
    await mainDb.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM ru_en_word WHERE id = ?",
        [id],
        (_, res) => {
          if (res.rows.length > 0) result.main = res.rows.item(0);
        }
      );
      tx.executeSql(
        `SELECT ru_en_word_dic.*, en_ru_word.t_inline, en_ru_word.transcription_us,
                GROUP_CONCAT(en_ru_sentence.original, '~') as original,
                GROUP_CONCAT(en_ru_sentence.translation, '~') as translation
        FROM ru_en_word_dic
        LEFT JOIN en_ru_word ON en_ru_word.word=ru_en_word_dic.en_word
        LEFT JOIN ru_en_word_dic_ex ON ru_en_word_dic.id=ru_en_word_dic_ex.ru_dic_id
        LEFT JOIN en_ru_sentence ON ru_en_word_dic_ex.ex_id=en_ru_sentence.id
        WHERE ru_en_word_dic.ru_word_id = ? AND en_ru_word.t_inline NOT NULL
        GROUP BY ru_en_word_dic.id
        ORDER BY section, word_order`,
        [id],
        (_, res) => {
          for (let i = 0; i < res.rows.length; i++) result.dictionary.push(res.rows.item(i));
        }
      );
    });
    const [dicRes] = await dicDb.executeSql("SELECT id FROM dictionary WHERE word = ?", [word]);
    if (dicRes.rows.length > 0) result.inDictionary = true;
  } catch (error) {
    console.error('Error fetching word details:', error);
  }
  return result;
};