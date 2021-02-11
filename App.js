import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./navigation/Home";
import LogScreen from "./navigation/Log";
import TimerScreen from "./navigation/Timer";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focuzed, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "ios-home";
            } else if (route.name === "Timer") {
              iconName = "ios-timer";
            } else if (route.name === "Logs") {
              iconName = "ios-list";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "tomato",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="Logs" component={LogScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
