import React, { useState } from 'react';
import {
    Text,
    View,
    StatusBar,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function SignIn() {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUp, setSignup] = useState(false); // false -> tela Login | true -> tela Cadastro
    const [loading, setLoading] = useState(false);

    function handleLogin() {
        setLoading(true);
        // Cadastrar o usuario (tela de signUp)
        if (signUp) {
            if (name === '' || email === '' || password === '') {
                alert('Insira todos os dados corretamente!');
                return;
            }

            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(user => {
                    user.user
                        .updateProfile({
                            displayName: name,
                        })
                        .then(() => {
                            console.log('Sucess Login!');
                            navigation.goBack();
                        });
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('Email já em uso!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('Email inválido!');
                    }

                    setLoading(false);
                    console.error(error);
                });
        } else {
            // Logar um usuário

            setLoading(true);

            auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    navigation.goBack();
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        alert('Email já em uso!');
                        console.log('Email já em uso!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        alert('Email inválido!');
                        console.log('Email inválido!');
                    }

                    setLoading(false);
                    console.error(error);
                });
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='#fff' barStyle='dark-content' />
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    enabled
                    style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.logo}>HeyGrupos</Text>

                    <Text style={styles.descp}>Ajude, colabora, faça networking!</Text>

                    {signUp && (
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={text => setName(text)}
                            placeholder="Qual seu Nome?"
                            placeholderTextColor="#99999b"
                        />
                    )}

                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        placeholder="Seu email"
                        placeholderTextColor="#99999b"
                    />

                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        placeholder="Sua senha"
                        placeholderTextColor="#99999b"
                        secureTextEntry={true}
                    />

                    <TouchableOpacity
                        onPress={handleLogin}
                        style={[
                            styles.btnLogin,
                            { backgroundColor: signUp ? '#f52745' : '#57dd86' },
                        ]}>

                        {loading ?
                            <ActivityIndicator size={25} color='#fff' />
                            : (
                                <Text style={styles.btnText}>
                                    {signUp ? 'Cadastrar' : 'Acessar'}
                                </Text>
                            )
                        }

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setSignup(!signUp)}>
                        <Text>
                            {signUp ? 'Já tenho uma conta' : 'Quero criar uma conta'}
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    logo: {
        paddingTop: Platform.OS === 'ios' ? 80 : 55,
        fontSize: 28,
        fontWeight: 'bold',
    },
    descp: {
        marginBottom: 20,
    },
    input: {
        color: '#121212',
        backgroundColor: '#EBEBEB',
        width: '90%',
        borderRadius: 6,
        paddingHorizontal: 8,
        marginBottom: 10,
        height: 50,
    },
    btnLogin: {
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 6,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 19,
    },
});
