import React, { useState } from "react";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }) => {

    const verifyUsername = async (storedUsername) => {
        try {
            const response = await fetch('https://chat-api-k4vi.onrender.com/chat/username', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: storedUsername })
            });
            const data = await response.json();
            if (response.status === 200) {
                navigation.replace('RoomsList', { username: data.username });
            } else {
                navigation.replace('Username');
            }
        } catch (error) {
            navigation.replace('Username');
        }
    }

    const retrieveUsername = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
                verifyUsername(storedUsername);
            } else {
                navigation.replace('Username');
            }
        } catch (error) {
            console.error("Error retrieving data:", error);
            navigation.replace('Username')
        }
    };

    useEffect(() => {
        setTimeout(() => {
            retrieveUsername();
        }, 2000)
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.appicon} source={require('../../assets/appicon.png')} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    appicon: {
        height: 120,
        width: 120,
    }
})

export default SplashScreen;