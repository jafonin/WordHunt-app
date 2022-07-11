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