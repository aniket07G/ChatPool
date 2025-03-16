import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Username = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [validationError, setValidationEerror] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValidationEerror("");
    }, [username])

    const storeSession = async (data) => {
        try {
            await AsyncStorage.clear();
            await AsyncStorage.setItem('username', data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleEnterChat = async () => {
        setValidationEerror("");
        setLoading(true);
        if (username.trim() !== "") {
            try {
                const response = await fetch('https://chat-api-k4vi.onrender.com/chat/username', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: username.trim() })
                });
                const data = await response.json();
                if (response.status === 200) {
                    storeSession(data.username);
                    navigation.replace('RoomsList', { username: data.username });
                    setLoading(false);
                } else if (response.status === 422) {
                    setValidationEerror(data.detail[0].msg);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                if (error.message) {
                    setValidationEerror(error.message);
                    setLoading(false);
                } else {
                    console.error("Error:", error);
                }
            }
        } else {
            setValidationEerror("String should have at least 3 characters");
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Image style={styles.appicon} source={require('../../assets/appicon.png')} />
                        <View style={styles.appnamecontainer}>
                            <Text style={styles.chattext}>Chat</Text>
                            <Text style={styles.pooltext}>Pool</Text>
                        </View>
                        <Text style={styles.welcometext}>Welcome!</Text>
                        <TextInput
                            style={styles.forUsername}
                            value={username}
                            placeholder="Enter your username"
                            placeholderTextColor="gray"
                            onChangeText={setUsername}
                        />
                        <View style={styles.errormassagecontainer}>
                            {validationError ?
                                <Text style={styles.errortext}>{validationError}</Text> : null
                            }
                        </View>
                        <TouchableOpacity
                            style={styles.enterchatcontainer}
                            disabled={loading ? true : false}
                            onPress={() => handleEnterChat()}>
                            {!loading ?
                                <Text style={styles.enterchattext}>Enter Chat</Text>
                                : <ActivityIndicator size={"large"} color={"#FFFFFF"} />
                            }
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    appicon: {
        height: 100,
        width: 100,
        alignSelf: 'center',
        marginTop: windowHight * 0.035
    },
    appnamecontainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: windowWidth * 0.02
    },
    chattext: {
        fontSize: windowWidth * 0.08,
        fontWeight: '600',
        color: '#14cfff'
    },
    pooltext: {
        fontSize: windowWidth * 0.08,
        fontWeight: 'bold',
        color: '#28abfa'
    },
    forUsername: {
        width: windowWidth * 0.85,
        height: windowHight * 0.075,
        borderWidth: 2,
        borderColor: '#cccccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: windowWidth * 0.04,
        alignSelf: 'center',
        marginTop: windowHight * 0.03,
        paddingLeft: windowWidth * 0.04
    },
    welocmetext: {
        fontSize: windowWidth * 0.06,
        alignSelf: 'center',
        marginTop: windowHight * 0.1,
        fontWeight: '600',
        color: '#444444'
    },
    enterchatcontainer: {
        width: windowWidth * 0.85,
        height: windowHight * 0.075,
        backgroundColor: '#007bff',
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    enterchattext: {
        alignSelf: 'center',
        color: 'white',
        fontWeight: '500',
        fontSize: windowWidth * 0.06
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errormassagecontainer: {
        width: windowWidth * 0.85,
        height: windowHight * 0.03,
    },
    errortext: {
        marginLeft: windowWidth * 0.03,
        fontWeight: '400',
        color: 'red',
    }
})

export default Username;