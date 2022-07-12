
                                    ФИКСЫ ОШИБОК

При установке библиотеки react navigator:   it worked with me after adding

                                            plugins: [
                                            'react-native-reanimated/plugin',
                                            ]
                                            in babel.config.js
                                            after that npm start --reset-cache 


                                            I changed in android/app/build.gradle
                                            project.ext.react = [ enableHermes: true ]


Приложение заработало без следующих действий (следующие действия не обязательны в моем случае): 

                                            and in the MainApplication.java
                                            I added on top
                                            import com.facebook.react.bridge.JSIModulePackage;
                                            import com.swmansion.reanimated.ReanimatedJSIModulePackage;
                                            and in the function ReactNative Host () I added
                                            @Override protected JSIModulePackage getJSIModulePackage() { return new ReanimatedJSIModulePackage(); }

Для отображения векторных иконок на ios читай документацию:                                    C:\Test\WordHunt\node_modules\react-native-vector-icons\README.md


==============================================================================================
                                ИДЕИ "НА БУДУЩЕЕ"

В src\Components\Header.js используется <Pressable></Pressable>, в дальнейшем можно будет сделать дополнительные функции(напр.: действие по долгому нажатию)





==============================================================================================
                                    БИБЛИОТКИ
    
    react-native-vector-icons
C:\Test\WordHunt\node_modules\react-native-vector-icons\README.md


    @react-navigation/native

