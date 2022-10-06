import React, { useEffect, useState } from 'react';
import { StatusBar, TouchableOpacity, View, FlatList, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ChatMessage from '../../Components/ChatMessage';
import Feather from 'react-native-vector-icons/Feather';

export default function Messages({ route }) {

    const { thread } = route.params;
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('');

    const user = auth().currentUser.toJSON();

    useEffect(() => {
        // monitorar em realtime a colecao de mensagens => onSnapShot
        const unSubscribeListener = firestore().collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data()

                    const data = {
                        _id: doc.id,
                        text: '',
                        createdAt: firestore.FieldValue.serverTimestamp(),
                        ...firebaseData
                    }

                    // verificar se a mensagem foi enviada pelo user 
                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            name: firebaseData.user.displayName
                        }
                    }
                    return data;
                });
                setMessages(messages);
                // console.log(messages);
            })

        // parar de executar o onSnapshot quando sair da tela
        return () => {
            unSubscribeListener();
        }
    }, [])

    async function handleSend() {
        if (input === '') {
            return;
        }

        await firestore().collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .add({
                text: input,
                createdAt: firestore.FieldValue.serverTimestamp(),
                user: {
                    _id: user.uid,
                    displayName: user.displayName,
                }
            })

        await firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .set(
                {
                    lastMessage: {
                        text: input,
                        createdAt: firestore.FieldValue.serverTimestamp(),
                    },
                },
                { merge: true } // nao substitui todas as informações do campo -> ele concatena com o ponto lastmessage com o que estava
            )

        setInput('');
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle='dark-content' />
            <FlatList
                data={messages}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <ChatMessage data={item} user={user} />}
                style={styles.list}
                inverted={true}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ width: '100%' }}
                keyboardVerticalOffset={100}
            >
                <View style={styles.containerInput}>
                    <View style={styles.mainContainerInput}>
                        <TextInput
                            placeholder='Digite sua mensagem...'
                            style={styles.textInput}
                            value={input}
                            onChangeText={text => setInput(text)}
                            multiline={true}
                            autoCorrect={false}
                        />
                    </View>

                    <TouchableOpacity onPress={() => handleSend()} activeOpacity={0.6} style={styles.btnContainer}>
                        <Feather name='send' size={22} color='#fff' />
                    </TouchableOpacity>
                </View>


            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        width: '100%',
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        margin: 10,
    },
    mainContainerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 25,
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 15,
        maxHeight: 130,
        minHeight: 48,
        color: '#121212',
        fontSize: 15,
    },
    btnContainer: {
        backgroundColor: '#51c880',
        width: 48,
        height: 48,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    }
});