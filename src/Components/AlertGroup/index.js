import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

export default function AlertGroup({ setVisible }) {

    return (
        <View style={styles.containerModal}>
            <TouchableWithoutFeedback onPress={setVisible}>
                <View style={styles.fill}></View>
            </TouchableWithoutFeedback>

            <View style={styles.modalContent}>
                <Text style={styles.title}>
                    Você já atingiu o limite de grupos criados!
                </Text>

                <View style={styles.row}>
                    {/*
                     <TouchableOpacity style={styles.btnCancel} onPress={setVisible}>
                        <Text style={styles.backBtn}>Voltar</Text>
                    </TouchableOpacity>
                     */}

                    <TouchableOpacity style={styles.btnCreateRoom} onPress={setVisible}>
                        <Text style={styles.btnText}>OK</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <TouchableWithoutFeedback onPress={setVisible}>
                <View style={styles.fill}></View>
            </TouchableWithoutFeedback>
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
        flex: 0.5,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 30,
        padding: 15,
    },
    title: {
        marginTop: 8,
        fontWeight: '600',
        fontSize: 19,
        color: '#121212',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 15,
        right: 20,
    },
    btnCreateRoom: {
        borderRadius: 4,
        backgroundColor: '#2E54D4',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    btnCancel: {
        borderRadius: 4,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginHorizontal: 8,
    },
    btnText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    backBtn: {
        fontSize: 16,
        textAlign: 'center',
        justifyContent: 'center',
    }
})