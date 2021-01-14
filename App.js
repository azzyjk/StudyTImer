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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // useEffect(() => {
  // setInterval(() => {
  //   console.log(`faces : ${faces.length}`);
  //   if (faces.length != 0) {
  //     console.log("interval 1000");
  //     // setTime(sec + 1);
  //   }
  // }, 1000);
  // if (faces.length > 0) {
  //   console.log("face not 0");
  // }
  // }, []);

  useEffect(() => {
    const _timeIncrease = setInterval(() => {
      var hour = parseInt(time.hour, 10);
      var min = parseInt(time.min, 10);
      var sec = parseInt(time.sec, 10);
      setTime({ hour: hour, min: min, sec: sec + 1 });
      clearInterval(_timeIncrease);
    }, 1000);
  }, [time.sec]);

  const _timeIncrease = () => {};

  // var hour = parseInt(time.hour, 10);
  // var min = parseInt(time.min, 10);
  // var sec = parseInt(time.sec, 10);-
  // setTime({ hour: hour, min: min, sec: sec + 1 });

  const _handleFacesDetected = ({ faces }) => {
    // console.log(faces);
    if (faces.length > 0) {
      setFaces(faces);
      console.log(`${faces[0].faceID}`);
      // console.log(`hour : ${time.hour} min : ${time.min} sec : ${time.sec}`);
      // console.log(faces[0]);
      // `smile : ${faces[0].smilingProbability}, left eye open : ${faces[0].leftEyeOpenProbability}`
    }
  };

  // console.log("hello");
  if (hasPermission == null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text> No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {time.hour}시 {time.min}분 {time.sec}초
      </Text>
    </View>
  );
  // return (
  //   <View style={styles.container}>
  //     <Camera
  //       style={styles.camera}
  //       type={type}
  //       onFacesDetected={_handleFacesDetected}
  //       faceDetectorSettings={{
  //         mode: FaceDetector.Constants.Mode.fast,
  //         detectLandmarks: FaceDetector.Constants.Landmarks.all,
  //         runClassifications: FaceDetector.Constants.Classifications.all,
  //         minDetetectionInterval: 1000,
  //         tracking: true,
  //       }}
  //     ></Camera>
  //   </View>
  // );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
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
