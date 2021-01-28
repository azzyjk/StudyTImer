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
  const [time, setTime] = useState({ hour: 0, min: 0, sec: 0 });
  const [clock, setClock] = useState({ hour: 0, min: 0, sec: 0 });
  const [isMeasure, setIsMeasure] = useState(false);
  const [measureText, setMeasureText] = useState("측정 시작");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    var calTime;
    const _timeIncrease = setInterval(() => {
      var getTime = { hour: time.hour, min: time.min, sec: time.sec };
      var getClock = { hour: clock.hour, min: clock.min, sec: clock.sec };

      // time + 1이 되기전에 useEffect가 다시 실행되서 time + 1이 제대로 안되는것 같아서 위치 변경
      if (faces.length != 0 && isMeasure == true) {
        calTime = _calTime(time);
        setTime({ hour: calTime.hour, min: calTime.min, sec: calTime.sec });
      }

      // useEffect 매초 실행되도록
      calTime = _calTime(clock);
      setClock({ hour: calTime.hour, min: calTime.min, sec: calTime.sec });
      clearInterval(_timeIncrease);
    }, 1000);
  }, [clock]);

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
  const _saveData = async () => {
    try {
      var day = String(new Date().getDate());
      var month = String(new Date().getMonth() + 1);
      var year = String(new Date().getFullYear());
      var date = year + month + day;
      // const date = new Date();
      // const formattedDate = format(date, "NN");
      // console.log(date);
      // console.log(formattedDate);
      const data = "testing azzyjk";
      await AsyncStorage.setItem(date, data);
    } catch (e) {}
  };
  const _loadData = async () => {
    try {
      // const data = await AsyncStorage.getItem("data");
      const data = await AsyncStorage.getAllKeys();
      console.log(data);
    } catch (e) {}
  };

  const _handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      setFaces(faces);
    } else {
      setFaces([]);
    }
  };

  const _changeState = () => {
    // console.log(`Miseasure : ${isMeasure}`);
    if (isMeasure == false) {
      setIsMeasure(true);
      Alert.alert(`측정을 시작합니다.`);
      setMeasureText("측정 종료");
    } else {
      setIsMeasure(false);
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
          {time.hour}시 {time.min}분 {time.sec}초
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={_changeState}>
          <Text style={styles.buttonText}> {measureText} </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={_saveData}>
          <Text style={styles.buttonText}> Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={_loadData}>
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
    margin: 20,
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
