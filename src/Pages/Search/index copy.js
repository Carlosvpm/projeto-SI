import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    StatusBar,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { useIsFocused } from '@react-navigation/native';
import ChatList from '../../Components/ChatList';

export default function Search() {
    // garante que toda vez que o usuario abrir a tela ele vai carregar o useEffect
    const isFocused = useIsFocused();

    const [input, setInput] = useState('');
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);

    useEffect(() => {

        const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
        setUser(hasUser);

    }, [isFocused])

    // PESQUISA NO FIREBASE AO CLICAR NO BOTÂ => DEVOLVE A LISTA DE ELEMENTOS CORRESPONDENTES
    async function handleSearch() {
        if (input === '')
            return;

        const response = await firestore()
            .collection('MESSAGE_THREADS')
            .where('name', '>=', input)
            .where('name', '<=', input + '\uf8ff')
            .get()
            .then((querySnapshot) => {
                const threads = querySnapshot.docs.map(doc => {
                    return {
                        _id: doc.id,
                        name: '',
                        lastMessage: {
                            text: '',
                        },
                        ...doc.data()
                    }
                })

                setGroups(threads);
                setInput('');
                Keyboard.dismiss();
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle='dark-content' />
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    enabled
                    style={{ flex: 1 }}
                >
                    <View style={styles.containerInput}>
                        <TextInput
                            placeholder='Digite o nome do grupo'
                            value={input}
                            onChangeText={text => setInput(text)}
                            style={styles.input}
                            autoCapitalize='none'
                        />
                        <TouchableOpacity
                            onPress={() => handleSearch()}
                            style={styles.btnSearch}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name='search' size={30} color='#f9f9f9' />
                        </TouchableOpacity>
                    </View>

                    {groups.length > 0 ?
                        <FlatList
                            data={groups}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => <ChatList data={item} userStatus={user} />}
                            showsVerticalScrollIndicator={false}
                        />
                        :
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 25, paddingHorizontal: 40, }}>
                            <Text style={{ fontSize: 15, fontWeight: '600', textAlign: 'center' }}>
                                Não encontramos nenhum grupo com esse nome 😥
                            </Text>
                        </View>}

                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 14,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    input: {
        backgroundColor: '#ebebeb',
        height: 50,
        width: '80%',
        borderRadius: 4,
        padding: 5,
        fontSize: 18,
    },
    btnSearch: {
        backgroundColor: '#2e54d4',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        height: 50,
        width: '15%',
        marginLeft: 10,
    },
})