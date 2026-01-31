import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {name: 'wordhunt.db',
    createFromLocation: "~wordhunt.db", 
    location: 'default'
},
  () => { console.log("Database opened successfully"); },
  (err) => { console.error("Error opening database:", err); }
);

const dbDic = SQLite.openDatabase(
    {
        name: 'UserDictionary.db',
        location: 'default'
    },
    () => {console.log('User Dic DB Connected')
        dbDic.transaction(tx => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS dictionary (id INTEGER PRIMARY KEY, word TEXT, word_id INTEGER, t_inline TEXT, transcription_us TEXT, transcription_uk TEXT, date INTEGER);"
        );
        });
    },
    error => console.error('User Dic DB Error', error),
);

export const searchWordsInDb = async (searchText) => {
  if (!searchText || searchText.trim() === '') {
    return [];
  }

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
  
  const params = [`${searchText.toLowerCase()}%`];

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        params,
        (tx, results) => {
          let words = [];
          for (let i = 0; i < results.rows.length; i++) {
            words.push(results.rows.item(i));
          }
          resolve(words);
        },
        (tx, err) => {
          console.error("SQL Error:", err);
          reject(err);
        }
      );
    });
  });
};

export const getWordFullDetails = async (id, word) => {
    // console.log(`[DB] Запрос деталей для ID: ${id}, Word: ${word}`);
    return new Promise((resolve, reject) => {
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

            db.transaction(tx => {
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
            },
            (err) => reject(err), 
            () => {
                dbDic.transaction(tx => {
                    tx.executeSql("SELECT id FROM dictionary WHERE word = ?", [word], (_, res) => {
                    if (res.rows.length > 0) result.inDictionary = true;
                    resolve(result);
                    }, () => resolve(result));
                }, () => resolve(result));
            });
        });
    };
    

export const getRuWordDetails = async (id, word) => {
  return new Promise((resolve) => {
    const result = { main: null, dictionary: [], inDictionary: false };
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM ru_en_word WHERE id = ?", [id], (_, res) => { if (res.rows.length > 0) result.main = res.rows.item(0); });
      tx.executeSql("SELECT ru_en_word_dic.*, en_ru_word.t_inline, en_ru_word.transcription_us, GROUP_CONCAT(en_ru_sentence.original, '~') as original, GROUP_CONCAT(en_ru_sentence.translation, '~') as translation FROM ru_en_word_dic LEFT JOIN en_ru_word ON en_ru_word.word=ru_en_word_dic.en_word LEFT JOIN ru_en_word_dic_ex ON ru_en_word_dic.id=ru_en_word_dic_ex.ru_dic_id LEFT JOIN en_ru_sentence ON ru_en_word_dic_ex.ex_id=en_ru_sentence.id WHERE ru_en_word_dic.ru_word_id = ? AND en_ru_word.t_inline NOT NULL GROUP BY ru_en_word_dic.id ORDER BY section, word_order", [id], (_, res) => {
        for (let i = 0; i < res.rows.length; i++) result.dictionary.push(res.rows.item(i));
      });
    }, null, () => {
      dbDic.transaction(tx => {
        tx.executeSql("SELECT id FROM dictionary WHERE word = ?", [word], (_, res) => {
          if (res.rows.length > 0) result.inDictionary = true;
          resolve(result);
        }, () => resolve(result));
      }, () => resolve(result));
    });
  });
};

// Сюда мы позже добавим:
// export const addToHistory = ...
// export const getDictionary = ...