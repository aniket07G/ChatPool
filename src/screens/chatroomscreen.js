import React, { useEffect, useState, useRef } from "react";
import { View, TouchableOpacity, BackHandler, Text, Dimensions, StyleSheet, FlatList, TextInput, ImageBackground, ActivityIndicator, InteractionManager } from "react-native";
import { connectWebSocket, sendMessage, closeWebSocket } from "../webSocketService/webSocket";
import { SafeAreaView } from "react-native-safe-area-context";
import Send from "react-native-vector-icons/MaterialCommunityIcons";
import Back from "react-native-vector-icons/FontAwesome6";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const ignoreCode = "->joinleave->codac->@#$!";

const ChatRoom = ({ navigation, route }) => {
    const username = route.params.username;
    const roomID = route.params.roomID;
    const roomName = route.params.roomname;
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);



    console.log(username, roomID, roomName);

    const fetchPreviousMSSG = async () => {
        try {
            const response = await fetch(`https://chat-api-k4vi.onrender.com/chat/rooms/${roomID}/messages`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            const responseData = await response.json();
            responseData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            setMessages(responseData);
        } catch (error) {
            console.log(error);
        }
    }

    const manageloading = (data) => {
        setLoading(data);
    }

    const reconnectWebSocket = () => {
        connectWebSocket(roomID, username, getNewMSSG, reconnectWebSocket, manageloading);
    }

    const getNewMSSG = (newMessage) => {
        if (newMessage.event === 'message') {
            setMessages(prevMessages => [...prevMessages, newMessage.message]);
        } else if (newMessage.event === 'join') {
            if (newMessage.username === username) {
                const joinmessage = `${username} has joined the room ${ignoreCode}`;
                sendMessage(joinmessage);
            }
        }
    }

    const handleBack = () => {
        closeWebSocket(username);
        navigation.goBack("RoomsList");
    }

    const handleSend = () => {
        if (inputText.trim() !== "") sendMessage(inputText.trim());
        setInputText("");
    }

    useEffect(() => {
        const onBackPress = () => {
            handleBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
        fetchPreviousMSSG();
        connectWebSocket(roomID, username, getNewMSSG, reconnectWebSocket, manageloading);
        return () => {
            if (backHandler && typeof backHandler.remove === "function") {
                backHandler.remove();
            }
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.arroback} onPress={() => handleBack()}>
                    <Back name='arrow-left-long' size={windowWidth * 0.08} color={'#FFFFFF'} />
                </TouchableOpacity>
                <View style={styles.roomnamecontainer}>
                    <Text numberOfLines={1} style={styles.roomnametext}>{roomName}</Text>
                </View>
            </View>
            <ImageBackground
                source={require('../../assets/appicon.png')}
                style={styles.imagebackground}
                imageStyle={{ opacity: 0.2 }}
                resizeMode={"contain"}
            >
                <FlatList
                    ref={flatListRef}
                    showsVerticalScrollIndicator={false}
                    data={messages}
                    keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
                    contentContainerStyle={styles.flatListContainer}
                    renderItem={({ item }) => {
                        { console.log("checking", item.username, "===", username) }
                        return (
                            <View style={
                                item.content.includes(ignoreCode) ? styles.joinleavecontainer
                                    : item.username === username ? styles.chatcontainerByyou
                                        : styles.chatcontainerByothers}
                            >
                                {(item.username !== username && !item.content.includes(ignoreCode)) &&
                                    <View style={styles.sendbycontainer}>
                                        <Text style={styles.sendbytext}>from</Text>
                                        <Text style={styles.usernametext}>{item.username}</Text>
                                    </View>
                                }
                                <Text style={item.content.includes(ignoreCode) ? styles.joinleavetext : styles.messagetext}>
                                    {item.content.includes(ignoreCode)
                                        ? item.content.replace(ignoreCode, "").replace(username, "You") : item.content}
                                </Text>
                            </View>
                        )
                    }}
                    onContentSizeChange={() => {
                        InteractionManager.runAfterInteractions(() => {
                            requestAnimationFrame(() => {
                                flatListRef.current?.scrollToEnd({ animated: true });
                            });
                        });
                    }}
                />

            </ImageBackground>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={(text) => {
                        setInputText(text);
                    }}
                    placeholder="Type a message..."
                />
                <TouchableOpacity
                    style={[styles.sendcontainer, { opacity: inputText.trim() === "" && !loading ? 0.3 : 1 }]}
                    disabled={inputText.trim() === "" ? true : false}
                    onPress={() => handleSend()}>
                    {loading ? <ActivityIndicator size={'large'} color={'#28abfa'} /> :
                        <Send name="send" size={windowWidth * 0.09} color={'#28abfa'} />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: windowWidth,
        height: windowHight * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#28abfa',
        position: 'relative',
    },
    arroback: {
        position: 'absolute',
        left: windowWidth * 0.03,
    },
    roomnametext: {
        fontSize: windowWidth * 0.06,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    roomnamecontainer: {
        height: windowHight * 0.06,
        width: windowWidth * 0.7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatcontainerByothers: {
        backgroundColor: "#F8F9FA",
        padding: windowWidth * 0.02,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        maxWidth: "70%",
        alignSelf: "flex-start",
        margin: windowWidth * 0.015,
        marginLeft: windowWidth * 0.025
    },
    chatcontainerByyou: {
        backgroundColor: "#DCF8C6",
        padding: windowWidth * 0.02,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        maxWidth: "70%",
        alignSelf: "flex-end",
        margin: windowWidth * 0.015,
        marginRight: windowWidth * 0.025,
        alignItems: 'flex-end'
    },
    joinleavecontainer: {
        backgroundColor: "#EDEDED",
        padding: windowWidth * 0.015,
        borderRadius: 15,
        maxWidth: "60%",
        alignSelf: "center",
        marginVertical: windowWidth * 0.01,
        alignItems: "center",
    },
    joinleavetext: {
        color: "#6B6B6B",
        fontSize: 13,
        fontWeight: "500",
        textAlign: "center",
    },
    messagetext: {
        fontSize: windowWidth * 0.05,
        fontWeight: '500',
    },
    inputContainer: {
        backgroundColor: "#fff",
        padding: windowWidth * 0.01,
        flexDirection: "row",
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    input: {
        flex: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        marginLeft: 10,
        fontSize: windowWidth * 0.04
    },
    sendcontainer: {
        marginRight: windowHight * 0.015
    },
    sendbycontainer: {
        flexDirection: 'row',
    },
    usernametext: {
        marginLeft: windowWidth * 0.01,
        color: "#1E3A8A",
        fontWeight: '400'
    },
    sendbytext: {
        color: '#333333'
    },
    imagebackground: {
        flex: 1,
        resizeMode: 'cover',
    }
})

export default ChatRoom;