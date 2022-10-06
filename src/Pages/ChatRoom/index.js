import React, { useEffect, useState } from 'react';
import {
    StatusBar,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Alert,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FabButton from '../../Components/FabButton';
import ModalNewRoom from '../../Components/ModalNewRoom';
import ModalSignOut from '../../Components/ModalSIgnOut';
import ChatList from '../../Components/ChatList';

export default function ChatRoom() {

    const navigation = useNavigation();
    const isFocus = useIsFocused();

    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleModalOut, setVisibleModalOut] = useState(false);
    const [user, setUser] = useState('null');
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
        // console.log(hasUser);

        setUser(hasUser);

        // toda vez que a tela for carregada, vai carregar o useEffect novamente
    }, [isFocus])

    // buscar os grupos
    useEffect(() => {

        let isActive = true;

        function getChats() {
            firestore()
                .collection('MESSAGE_THREADS')
                .orderBy('lastMessage.createdAt', 'desc')
                .limit(10)
                .get()
                .then((snapshot) => {
                    const threads = snapshot.docs.map((documentSnapshot) => {
                        return {
                            //retorna as informacoes do grupo
                            _id: documentSnapshot.id,
                            name: '',
                            lastMessage: { text: '' },
                            ...documentSnapshot.data(0)
                        }
                    })
                    if (isActive) {
                        setThreads(threads);
                        setLoading(false);
                        // console.log(threads);
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }

        getChats();

        return () => {
            isActive = false;
        }
    }, [isFocus, threads])

    function AlertSignOut() {

        setVisibleModalOut(true);
        handleSignOut();

    }

    function handleSignOut() {
        auth()
            .signOut()
            .then(() => {
                setUser(null);
                navigation.navigate('SignIn')
            })
            .catch(error => {
                console.log("Não possui nenhum usúario!");
                console.log(error);
            })
    }

    function deleteRoom(ownerId, idRoom) {
        // apenas o dono da sala pode deletar
        if (ownerId !== user?.uid) {
            Alert.alert(
                "Atenção!",
                "Você não tem permissão para deletar esse grupo.",
                [
                    {
                        text: 'OK',
                        onPress: () => { },
                        style: 'cancel'
                    }
                ]
            )
            return;
        }

        Alert.alert(
            "Atenção!",
            "Você tem certeza que deseja deletar esse grupo?",
            [
                {
                    text: 'Cancelar',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => deleteGroupFirebase(idRoom),
                    style: 'default'
                }
            ]
        )

    }

    async function deleteGroupFirebase(idRoom) {
        await firestore().collection('MESSAGE_THREADS')
            .doc(idRoom)
            .delete();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='#2E54D4' barStyle='light-content' />
            <View style={styles.HeaderRoom}>
                <View style={styles.headerRoomLeft}>
                    {user && (
                        <TouchableOpacity onPress={() => setVisibleModalOut(true)} activeOpacity={0.6}>
                            <MaterialIcons name="arrow-back" size={28} color="#FFF" />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.title}>
                        Grupos
                    </Text>
                </View>

                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('Search')}>
                    <MaterialIcons name="search" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' color="#2e54d4" />
                </View>
            )
                :
                (
                    <View style={styles.contentList}>
                        <FlatList
                            data={threads}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => <ChatList data={item} deleteRoom={() => deleteRoom(item.owner, item._id)} userStatus={user} />}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                )
            }


            <FabButton setVisible={() => setVisibleModal(true)} userStatus={user} />

            <Modal visible={visibleModalOut} animationType='fade' transparent={true}>
                <ModalSignOut setVisible={() => setVisibleModalOut(false)} signOut={() => AlertSignOut()} />
            </Modal>

            <Modal visible={visibleModal} animationType='fade' transparent={true}>
                <ModalNewRoom setVisible={() => setVisibleModal(false)} />
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentList: {
        flex: 1,
    },
    HeaderRoom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 40 : 25,
        paddingBottom: 20,
        paddingHorizontal: 13,
        backgroundColor: '#2e54d4',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    headerRoomLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        paddingLeft: 10,
    },
});