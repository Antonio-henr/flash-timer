import {
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as SQLite from "expo-sqlite";
import React from "react";
import { Dimensions } from "react-native";


const { width } = Dimensions.get("window");


import papeldeparede from "../assets/pxfuel.jpg";
const db = SQLite.openDatabase("bdflashtimer3.db");

export default function Teste({ route, navigation }) {
 
    

  return (
    <View>
        <Text>
            Teste para aplicativo
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f0f7f4",
    alignItems: "center",
  },

  rightAction: {
    justifyContent: "center",
    alignItems: "flex-end",
  },

  botaomodal: {
    backgroundColor: "#A2E3C4",
    fontSize: width / 14,
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 8,
    shadowColor: "black",
    elevation: 8,
    fontWeight: "bold",
    textAlign: "center",
    width: width / 2,
    marginTop: 15,
    borderRightWidth: 2,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
});
