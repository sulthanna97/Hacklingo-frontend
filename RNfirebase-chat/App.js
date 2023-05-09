import 'expo-dev-client';
import React, { useState, useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, ActivityIndicator } from "react-native";
import AuthenticatedUserContext from "./helper/AuthenticatedUserContext";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Chat from "./screens/Chat";
import ChatList from "./screens/Chatlist";
import Contacts from "./screens/Contacts";
import GroupChat from "./screens/GroupChat";
import Groups from "./screens/Group";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderChat } from './screens/HeadersChat/HeaderChat';
import CreateGroupChat from './screens/CreateGroupChat'; // Import the CreateGroupChat component
import Profile from './components/Profile';
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "./config/firebase";
import Toast from 'react-native-toast-message';
import toastConfig from "./config/toastConfig";

import { Provider } from 'react-redux';
import { store } from './stores/mainReducer';
import VideoChat from './screens/VideoChat';
import Home from './screens/Home'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function ChatTopTabNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderChat />
      <TopTab.Navigator>
        <TopTab.Screen name="Find Contacts" component={Contacts} />
        <TopTab.Screen name="Find Groups" component={Groups} />
      </TopTab.Navigator>
    </SafeAreaView>
  );
}

function ChatBottomTabNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderChat />
      <BottomTab.Navigator>
        <BottomTab.Screen name="Home" component={Home} />
        <BottomTab.Screen
          name="Chats"
          options={{ tabBarLabel: 'Chats' }}
          children={() => (
            <TopTab.Navigator>
              <TopTab.Screen name="Chat Lists" component={ChatList} />
              <TopTab.Screen name="Find Contacts" component={Contacts} />
              <TopTab.Screen name="Find Groups" component={Groups} />
            </TopTab.Navigator>
          )}
        />
      </BottomTab.Navigator>
    </SafeAreaView>
  );
}
function ChatStack() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator>
        <Stack.Screen name="ChatList" component={ChatBottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="Group Chat" component={GroupChat} />
        <Stack.Screen name="CreateGroupChat" component={CreateGroupChat} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Video Chat" component={VideoChat} options={{ headerShown: false }} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen name="ChatStack" component={ChatStack} options={{ headerShown: false }} />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthenticatedUserProvider>
        <RootNavigator />
        <Toast config={toastConfig} />
      </AuthenticatedUserProvider>
    </Provider>
  );
}