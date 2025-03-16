import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Dimensions, StyleSheet, TextInput, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image } from "react-native";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import Back from "react-native-vector-icons/FontAwesome6";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const CreateRoom = ({ navigation, route }) => {
    const username = route.params.username;
    const [roomname, setRoomname] = useState("");
    const [loading, setLoading] = useState(false);
    const [errormessage, setErrormessage] = useState("");
    console.log("username", username);

    const handleBack = () => {
        navigation.goBack("RoomsList");
    }

    useEffect(() => {
        setErrormessage("");
    }, [roomname])

    const createRoom = async () => {
        try {
            const response = await fetch('https://chat-api-k4vi.onrender.com/chat/rooms', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: roomname.trim() })
            })
            const responseData = await response.json();
            setLoading(false);
            if (responseData?.detail) {
                setErrormessage(responseData.detail);
            }
            else {
                navigation.replace("ChatRoom", { roomID: responseData.id, username: username, roomname: responseData.name })
            }

        } catch (error) {
            console.log("error", error);
            if (error.message) {
                setErrormessage(error.message);
                setLoading(false);
            }
        }
    }

    const handleContinue = () => {
        setLoading(true);
        createRoom();
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.arroback} onPress={() => handleBack()}>
                        <Back name='arrow-left-long' size={windowWidth * 0.08} color={'#FFFFFF'} />
                    </TouchableOpacity>
                    <Text style={styles.createroomtext}>Create Room</Text>
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Image style={styles.roomicon} source={require('../../assets/roomicon.png')} />
                        <TextInput
                            style={styles.forRoomname}
                            value={roomname}
                            placeholder="Enter room name"
                            placeholderTextColor="gray"
                            onChangeText={(text) => setRoomname(text)}
                        />
                        <View style={styles.errorcontainer}>
                            {errormessage ?
                                <Text style={styles.errortext}>{errormessage}</Text> : null
                            }
                        </View>
                        <TouchableOpacity style={[styles.continuecontainer, { opacity: roomname.trim() === "" && !loading ? 0.6 : 1 }]}
                            disabled={roomname.trim() === "" || loading ? true : false}
                            onPress={() => handleContinue()}>
                            {!loading ?
                                <Text style={styles.continuetext}>Continue</Text>
                                : <ActivityIndicator size={'large'} color={"#FFFFFF"} />
                            }
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        width: windowWidth,
        height: windowHight * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#28abfa',
        position: 'relative',
    },
    createroomtext: {
        fontSize: windowWidth * 0.05,
        color: '#FFFFFF',
        fontWeight: '600'
    },
    arroback: {
        position: 'absolute',
        left: windowWidth * 0.03,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    forRoomname: {
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
    continuecontainer: {
        width: windowWidth * 0.85,
        height: windowHight * 0.075,
        backgroundColor: '#007bff',
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continuetext: {
        alignSelf: 'center',
        color: 'white',
        fontWeight: '500',
        fontSize: windowWidth * 0.06
    },
    roomicon: {
        height: 100,
        width: 100,
        alignSelf: 'center',
        marginTop: windowHight * 0.035
    },
    errorcontainer: {
        width: windowWidth * 0.85,
        height: windowHight * 0.032,
    },
    errortext: {
        marginLeft: windowWidth * 0.03,
        fontWeight: '400',
        color: 'red',
    }
})

export default CreateRoom;