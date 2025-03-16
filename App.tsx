import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/splashscreen';
import Username from './src/screens/usernamescreen';
import RoomsList from './src/screens/roomslistscreen';
import ChatRoom from './src/screens/chatroomscreen';
import CreateRoom from './src/screens/createroomscreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Splash' component={SplashScreen} />
          <Stack.Screen name='Username' component={Username} />
          <Stack.Screen name='RoomsList' component={RoomsList} />
          <Stack.Screen name='ChatRoom' component={ChatRoom} />
          <Stack.Screen name='CreateRoom' component={CreateRoom} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App;
