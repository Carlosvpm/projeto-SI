import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ChatList({ data, deleteRoom, userStatus }) {
    const navigation = useNavigation();

    function openChat() {
        // se o usuario estiver logado ele consegue abrir o modal
        {
            userStatus ?
                (
                    navigation.navigate('Messages', { thread: data })
                )
                : (
                    Alert.alert(
                        "Ops!",
                        "Você deve estar logado para acessar um chat!",
                        [
                            {
                                text: 'Cancelar',
                                onPress: () => { },
                                style: 'cancel'
                            },
                            {
                                text: 'OK',
                                onPress: () => navigation.navigate('SignIn'),
                                style: 'default'
                            }
                        ]
                    ))
        }
    }

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => openChat()} onLongPress={() => deleteRoom && deleteRoom()}>
            <View style={styles.row}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.titleGroup} numberOfLines={1}>
                            {data.name}
                        </Text>
                    </View>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {data.lastMessage.text}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(241,240,245,0.5)',
        marginVertical: 4,
    },
    content: {
        // flexShrink: 1
    },
    header: {
        flexDirection: 'row',
    },
    titleGroup: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    lastMessage: {
        color: '#c1c1c1',
        marginTop: 2,
    },
})