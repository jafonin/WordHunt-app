import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    Pressable,
} from 'react-native';

export default function SearchDropDown(props) {
    const { dataSource } = props
    return (
        <Pressable
            onPress={props.onPress}
            style={styles.container}>

            <View style={styles.subContainer}>
                {
                    dataSource.length ?

                        dataSource.map(item => {
                            return (
                                <View style={styles.itemView}>                                   
                                    <Text style={styles.itemText}>{item}</Text>
                                </View>
                            )
                        })

                        :
                        <View
                            style={styles.noResultView}>
                            <Text style={styles.noResultText}>No search items matched</Text>
                        </View>
                }

            </View>
        </Pressable>

    )
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 59,
        left: 0, right: 0, bottom: 0,
        borderRadius: 15,
        
    },
    subContainer: {
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
        marginHorizontal: 20,
        flexWrap: 'wrap',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    itemView: {
        height: 30,
        width: '90%',
        marginBottom: 10,
        justifyContent: 'center',
        
    },
    itemText: {
        color: 'black',
        paddingHorizontal: 10,
    },
    noResultView: {
        alignSelf: 'center',
        // margin: 20,
        height: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    noResultText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'       
    },

});