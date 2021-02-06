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
import * as FaceDetector from "expo-face-detector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [faces, setFaces] = useState([]);
  const [studyTime, setStudyTime] = useState({ hour: 0, min: 0, sec: 0 });
  const [realTime, setrealTime] = useState({ hour: 0, min: 0, sec: 0 });
  const [isMeasure, setIsMeasure] = useState(false);
  const [measureText, setMeasureText] = useState("측정 시작");
  const [savedData, setSavedData] = useState({});

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

  const _handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      setFaces(faces);
    } else {
      setFaces([]);
    }
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

  if (hasPermission == null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text> No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        onFacesDetected={_handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.all,
          runClassifications: FaceDetector.Constants.Classifications.all,
          minDetetectionInterval: 1000,
          tracking: true,
        }}
      ></Camera>
      <View style={styles.textContainer}>
        <Text style={styles.timerText}>
          {studyTime.hour}시 {studyTime.min}분 {studyTime.sec}초
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={_changeState}>
          <Text style={styles.buttonText}> {measureText} </Text>
        </TouchableOpacity>
      </View>
      {Object.values(studyTime).map(() => (
        <Text> test </Text>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => _saveData(studyTime)}
        >
          <Text style={styles.buttonText}> Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={_loadAllData}>
          <Text style={styles.buttonText}> Load</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 0,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 40,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  timerText: {
    fontSize: 32,
  },
});
