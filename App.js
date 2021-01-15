import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FaceDetector from "expo-face-detector";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [faces, setFaces] = useState([]);
  const [time, setTime] = useState({ hour: 0, min: 0, sec: 0 });
  const [clock, setClock] = useState({ hour: 0, min: 0, sec: 0 });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    const _timeIncrease = setInterval(() => {
      var getTime = {
        hour: parseInt(time.hour, 10),
        min: parseInt(time.min, 10),
        sec: parseInt(time.sec, 10),
      };
      var getClock = {
        hour: parseInt(clock.hour, 10),
        min: parseInt(clock.min, 10),
        sec: parseInt(clock.sec, 10),
      };
      setClock({
        hour: getClock.hour,
        min: getClock.min,
        sec: getClock.sec + 1,
      });
      console.log(faces.length);
      if (faces.length != 0) {
        setTime({ hour: getTime.hour, min: getTime.min, sec: getTime.sec + 1 });
      }
      clearInterval(_timeIncrease);
    }, 1000);
  }, [clock]);

  const _handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      setFaces(faces);
    } else {
      setFaces([]);
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
      <Text style={styles.timerText}>
        {time.hour}시 {time.min}분 {time.sec}초
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 0.5,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  timerText: {
    fontSize: 24,
  },
});
