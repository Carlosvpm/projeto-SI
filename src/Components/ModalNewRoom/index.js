import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AlertGroup from '../AlertGroup';

export default function ModalNewRoom({ setVisible }) {

    const [roomName, setRoomName] = useState('');

    // pega qual o usuario logado
    const user = auth().currentUser.toJSON();
    const [visibleModal, setVisibleModal] = useState(false);

    function handleBtnCreate() {

        if (roomName === '')
            return

        // permitir que o usuario crie até 4 grupos somente
        firestore().collection('MESSAGE_THREADS')
            .get()
            .then((snapshot) => {
                let myGroups = 0;

                snapshot.docs.map((docItem) => {
                    if (docItem.data().owner === user.uid) {
                        myGroups++;
                    }
                })

                if (myGroups >= 4) {
                    setVisibleModal(true);
                    // alert('Você já atingiu o limite de grupos criados!')
                    return;
                }
                else {
                    createGroup();
                }
            })

    }

    //cria nova sala no firestore
    function createGroup() {

        firestore()
            .collection('MESSAGE_THREADS')
            .add({
                name: roomName,
                owner: user.uid,
                lastMessage: {
                    text: `Grupo ${roomName} criado. Bem vindo(a)!`,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                }
            })
            .then(docRef => {
                docRef.collection('MESSAGES')
                    .add({
                        text: `Grupo ${roomName} criado. Bem vindo(a)!`,
                        createdAt: firestore.FieldValue.serverTimestamp(),
                        system: true,
                    })
                    .then(() => {
                        setVisible();
                    })
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <View style={styles.containerModal}>
            <TouchableWithoutFeedback onPress={setVisible}>
                <View style={styles.fill}></View>
            </TouchableWithoutFeedback>

            <View style={styles.modalContent}>
                <Text style={styles.title}>Criar um novo Grupo?</Text>
                <TextInput
                    value={roomName}
                    onChangeText={(text) => setRoomName(text)}
                    placeholder='Nome da sua Sala?'
                    style={styles.input}
                />

                <TouchableOpacity onPress={handleBtnCreate} activeOpacity={0.8} style={styles.btnCreateRoom}>
                    <Text style={styles.btnText}>
                        Criar Sala
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={setVisible}>
                    <Text style={styles.backBtn}>Voltar</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={visibleModal} animationType='fade' transparent={true}>
                <AlertGroup setVisible={() => setVisibleModal(false)} />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    containerModal: {
        flex: 1,
        backgroundColor: 'rgba(34,34,34,0.4)'
    },
    fill: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 15,
    },
    title: {
        marginTop: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19,
        color: '#121212',
    },
    input: {
        borderRadius: 8,
        height: 45,
        backgroundColor: '#ddd',
        marginVertical: 15,
        fontSize: 16,
        paddingHorizontal: 5,
        paddingLeft: 12,
    },
    btnCreateRoom: {
        borderRadius: 8,
        backgroundColor: '#2E54D4',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontSize: 19,
        color: '#fff',
        fontWeight: 'bold',
    },
    backBtn: {
        textAlign: 'center',
        marginTop: 10,
        justifyContent: 'center'
    }
})