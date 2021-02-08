import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
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
    //     <View style={styles.textContainer}>
    //       <Text style={styles.timerText}>
    //         {studyTime.hour}시 {studyTime.min}분 {studyTime.sec}초
    //       </Text>
    //     </View>
    //     <View style={styles.buttonContainer}>
    //       <TouchableOpacity style={styles.button} onPress={_changeState}>
    //         <Text style={styles.buttonText}> {measureText} </Text>
    //       </TouchableOpacity>
    //     </View>
    //     {Object.values(studyTime).map(() => (
    //       <Text> test </Text>
    //     ))}
    //     <View style={styles.buttonContainer}>
    //       <TouchableOpacity
    //         style={styles.button}
    //         onPress={() => _saveData(studyTime)}
    //       >
    //         <Text style={styles.buttonText}> Save</Text>
    //       </TouchableOpacity>
    //     </View>
    //     <View style={styles.buttonContainer}>
    //       <TouchableOpacity style={styles.button} onPress={_loadAllData}>
    //         <Text style={styles.buttonText}> Load</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
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
