import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ChatMessage({ data, user }) {

    // console.log(data);
    // console.log(user);

    // o useMemo tem a funcao de verficiar se o valor é alterado 
    // funcao para verificar se o usuario que mandou a msg
    // o useMemo evita renderizações desnecessárias
    const isMyMessage = useMemo(() => {
        return data?.user?._id === user.uid
    }, [data])

    return (
        <View style={styles.container}>
            {/* verificar se a mensagem é do sistema */}
            {data.system ?
                (
                    <View style={[styles.messageBox,
                    {
                        backgroundColor: '#ebebeb',
                        justifyContent: 'center',
                        marginHorizontal: 30,
                    }]}>
                        <Text style={[styles.txtMessage, { fontSize: 13, textAlign: 'center', color: '#909090' }]}>
                            {data.text}
                        </Text>
                    </View>

                ) :
                <View style={[styles.messageBox,
                {
                    backgroundColor: isMyMessage ? '#dcf8c5' : '#fff',
                    marginLeft: isMyMessage ? 55 : 0,
                    marginRight: isMyMessage ? 0 : 55
                }]}>
                    {
                        !isMyMessage &&
                        <Text style={styles.nameUser}>
                            {data.user.displayName}
                        </Text>
                    }
                    <Text style={styles.txtMessage}>
                        {data.text}
                    </Text>
                </View>
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    messageBox: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ddd',
    },
    nameUser: {
        color: '#f53745',
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 15,
    },
    txtMessage: {
        color: '#121212',
        fontSize: 15,
    },
})