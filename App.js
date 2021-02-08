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

import { format } from "date-fns";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./navigation/Home";
import DetailsScreen from "./navigation/Detail";
import TimerScreen from "./navigation/Timer";

const Tab = createBottomTabNavigator();

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [faces, setFaces] = useState([]);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [measureText, setMeasureText] = useState("측정 시작");
  const [savedData, setSavedData] = useState({});
  const [studyTime, setStudyTime] = useState({ hour: 0, min: 0, sec: 0 });
  const [realTime, setrealTime] = useState({ hour: 0, min: 0, sec: 0 });
  const [isMeasure, setIsMeasure] = useState(false);

  const _calTime = (object) => {
    var res = { hour: object.hour, min: object.min, sec: object.sec };
    if (res.sec + 1 < 60) {
      res.sec += 1;
      return res;
    } else {
      res.sec = 0;
      if (res.min + 1 < 60) {
        res.min += 1;
        return res;
      } else {
        res.min = 0;
        res.hour += 1;
        return res;
      }
    }
  };
  const _handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      setFaces(faces);
    } else {
      setFaces([]);
    }
  };

  // 저장된 시간을 불러와서 현재 측정된 시간과 더했을때 60이 넘을 경우 처리
  const _calSavedData = (saved, now) => {
    saved.sec += now.sec;
    if (saved.sec > 60) {
      saved.sec -= 60;
      saved.min += 1;
    }
    saved.min += now.min;
    if (saved.min > 60) {
      saved.min -= 60;
      saved.hour += 1;
    }
    return saved;
  };

  const _saveData = async (studyTime) => {
    try {
      const formattedDate = format(new Date(), "yyyyMMdd");
      const todayData = await AsyncStorage.getItem(formattedDate);
      if (todayData == null) {
        await AsyncStorage.setItem(formattedDate, JSON.stringify(studyTime));
      } else {
        var savedTime = JSON.parse(todayData);
        savedTime = _calSavedData(savedTime, studyTime);
        await AsyncStorage.setItem(formattedDate, JSON.stringify(savedTime));
      }
      setStudyTime({ hour: 0, min: 0, sec: 0 });

      Alert.alert(`저장되었습니다.`);
    } catch (e) {}
  };

  const _loadAllData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log(keys);
      _loadData(keys);
    } catch (e) {}
  };

  const _loadData = (keys) => {
    setSavedData({});
    keys.forEach(async (element) => {
      var data = await AsyncStorage.getItem(element);
      setSavedData((prevState) => ({
        ...prevState,
        [element]: data,
      }));
    });
    console.log(`savedData : ${JSON.stringify(savedData, null, 2)}`);
  };

  const _changeState = () => {
    if (isMeasure == false) {
      setIsMeasure(true);
      Alert.alert(`측정을 시작합니다.`);
      setMeasureText("측정 종료");
    } else {
      setIsMeasure(false);
      Alert.alert(`측정을 종료합니다.`);
      setMeasureText("측정 시작");
    }
  };
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    var calTime;
    const _timeIncrease = setInterval(() => {
      var getTime = {
        hour: studyTime.hour,
        min: studyTime.min,
        sec: studyTime.sec,
      };
      var getrealTime = {
        hour: realTime.hour,
        min: realTime.min,
        sec: realTime.sec,
      };

      // time + 1이 되기전에 useEffect가 다시 실행되서 time + 1이 제대로 안되는것 같아서 위치 변경
      if (faces.length != 0 && isMeasure == true) {
        calTime = _calTime(studyTime);
        setStudyTime({
          hour: calTime.hour,
          min: calTime.min,
          sec: calTime.sec,
        });
      }

      // useEffect 매초 실행되도록
      calTime = _calTime(realTime);
      setrealTime({ hour: calTime.hour, min: calTime.min, sec: calTime.sec });
      clearInterval(_timeIncrease);
    }, 1000);
  }, [realTime]);

  if (hasPermission == null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text> No access to camera</Text>;
  }
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
        <Tab.Screen name="Logs" component={DetailsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
