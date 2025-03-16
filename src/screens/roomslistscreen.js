import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image, Dimensions, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Groups from "react-native-vector-icons/MaterialCommunityIcons";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const MAX_RETRIES = 7;

const RoomsList = ({ navigation, route }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const username = route.params.username;

    const fetchRooms = async (retrycnt = 0) => {
        setLoading(true);
        try {
            const response = await fetch('https://chat-api-k4vi.onrender.com/chat/rooms', {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            });
            const responseData = await response.json();
            setRooms(responseData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            setRefresh(false);
            setLoading(false);
        } catch (error) {
            console.log(error);
            if (retrycnt < MAX_RETRIES) {
                setTimeout(() => fetchRooms(retrycnt + 1), 3000);
            }
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchRooms(0);
        }, [])
    );

    useEffect(() => {
        fetchRooms(0);
    }, [])

    const handleRoom = (roomID, roonName) => {
        navigation.navigate("ChatRoom", { roomID: roomID, username: username, roomname: roonName });
    }

    const handleCreateRoom = () => {
        navigation.navigate("CreateRoom", { username: username })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.roomslisttext}>Rooms List</Text>
                <Text style={styles.usernametext} >{username}</Text>
            </View>
            {!loading ?
                <FlatList
                    data={rooms}
                    contentContainerStyle={styles.flatListContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.roomcontainer} key={item.id} onPress={() => handleRoom(item.id, item.name)}>
                                <Groups name='account-group-outline' size={windowWidth * 0.08} color={'black'} style={styles.groupsicon} />
                                <View style={styles.roomtitlecontainer}>
                                    <Text style={styles.roomnametext} numberOfLines={1}>{item.name}</Text>
                                </View>
                                <View style={styles.joincontainer}>
                                    <View style={styles.joinbutton}>
                                        <Text style={styles.jointext}>Join</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => fetchRooms(0)} />}
                /> :
                <View style={styles.loadingContainer}>
                    <View style={styles.loaderContainer}><ActivityIndicator size={'large'} color={"#28abfa"} /></View>
                </View>}
            <TouchableOpacity style={styles.createroomcontainer} onPress={() => { setRefresh(true); handleCreateRoom() }}>
                <Text style={styles.createroomtext}>Create Room</Text>
            </TouchableOpacity>
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
        alignItems: 'center',
        backgroundColor: '#28abfa',
        position: 'relative',
    },
    roomslisttext: {
        marginTop: windowHight * 0.015,
        fontSize: windowWidth * 0.05,
        color: '#FFFFFF',
        fontWeight: '600'
    },
    usernametext: {
        position: 'absolute',
        marginTop: windowHight * 0.045,
        fontSize: windowWidth * 0.03,
        fontWeight: '400',
        color: '#F0F8FF',
        textDecorationLine: 'underline'
    },
    roomcontainer: {
        flex: 1,
        flexDirection: 'row',
        height: windowHight * 0.1,
        width: windowWidth * 0.95,
        alignSelf: 'center',
        margin: windowWidth * 0.015,
        backgroundColor: "#F8F9FA",
        borderRadius: windowWidth * 0.03,
        justifyContent: 'center',
        alignItems: 'center'
    },
    groupsicon: {
        marginLeft: windowWidth * 0.025

    },
    flatListContainer: {
        flexGrow: 1,
    },
    roomnametext: {
        fontSize: windowWidth * 0.05,
        fontWeight: 'bold',
        color: '#333333',
        overflow: "hidden",
    },
    roomtitlecontainer: {
        height: windowHight * 0.1,
        width: windowWidth * 0.6,
        borderRadius: windowWidth * 0.03,
        justifyContent: 'center',
        marginLeft: windowWidth * 0.025,
    },
    joincontainer: {
        flex: 1,
        borderRadius: windowWidth * 0.03,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinbutton: {
        backgroundColor: '#28abfa',
        width: windowWidth * 0.16,
        height: windowHight * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    jointext: {
        color: 'white',
        fontSize: windowWidth * 0.055,
        fontWeight: '600'
    },
    createroomcontainer: {
        backgroundColor: '#28abfa',
        width: windowWidth,
        height: windowHight * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    createroomtext: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: windowWidth * 0.05
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loaderContainer: {
        transform: [{ scale: 1.7 }],
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default RoomsList;