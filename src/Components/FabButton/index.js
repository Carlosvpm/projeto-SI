import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

export default function FabButton({ setVisible, userStatus }) {
    const navigation = useNavigation();

    function handleNavigateButton() {
        // se o usuario estiver logado ele consegue abrir o modal
        userStatus ? setVisible() : navigation.navigate('SignIn')
    }

    return (
        <TouchableOpacity
            onPress={handleNavigateButton}
            style={styles.btnCont}
            activeOpacity={0.8}>
            <View>
                <Feather name='plus' size={28} color="#fff" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btnCont: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2e54d4',
        position: 'absolute',
        bottom: '5%',
        right: '6%',
    },
    icon: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
    }
})