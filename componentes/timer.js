import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import React from "react";

import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

import wallpaper from "../assets/wallpaper8.jpeg"


export default function Timer({ route, navigation }) {
  const obj = route.params;
  const [timer, settimer] = useState(10);
  const [cor, setcor] = useState([
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
  ]);

  const tempo = (i) => {
    settimer(i);
    let aux = [];
    for (let index = 0; index < cor.length; index++) {
      aux[index] = "#000";
    }

    if (i == 5) aux[0] = "green";
    else if (i == 7) aux[1] = "green";
    else if (i == 10) aux[2] = "green";
    else if (i == 12) aux[3] = "green";
    else if (i == 15) aux[4] = "green";
    else if (i == 20) aux[5] = "green";

    setcor([...aux]);
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
      source={wallpaper}
      style={{width:"100%", height:"100%", flex:1, alignItems:'center', justifyContent:'center'}}
      
      imageStyle={{opacity:0.9}}>
        
      
      <View
        style={{
          width: "95%",
          marginTop:-80,
          height: "60%",
          backgroundColor: route.params.cor,
          borderBottomWidth:2,
          borderRightWidth:3,
          borderRadius: 20,
        }}
      >
        <ImageBackground  style={{
          width: "100%",
          height: "100%",
          borderRadius: 20,
        }}
        
        source={require('../assets/papel.jpg')}
        imageStyle={{opacity:0.3}}
        
        >
        <Text
          style={{
            fontSize: width/12,
            fontFamily: "Montserrat_400Regular",
            marginTop: 30,
            // backgroundColor: route.params.cor,
            width: "100%",
            textAlign: "center",
            color: "black",
          }}
        >
          ESCOLHA O TEMPO:
        </Text>
        <View
          style={{
            width: "100%",
            marginTop: 50,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              tempo(5);
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
                color: cor[0],
                backgroundColor: "white",
                borderRadius: 17,
                borderBottomWidth:1,
                borderRightWidth:2,
                borderColor:"gray",
                paddingHorizontal: 15,
                paddingVertical: 10,
                shadowColor: "black",
                elevation: 10,
              }}
            >
              05 sec
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              tempo(7);
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
                color: cor[1],
                backgroundColor: "white",
                borderRadius: 17,
                borderBottomWidth:1,
                borderRightWidth:2,
                borderColor:"gray",
                paddingHorizontal: 15,
                paddingVertical: 10,
                shadowColor: "black",
                elevation: 10,
              }}
            >
              07 sec
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              tempo(10);
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
                color: cor[2],
                backgroundColor: "white",
                borderRadius: 17,
                borderBottomWidth:1,
                borderRightWidth:2,
                borderColor:"gray",
                paddingHorizontal: 15,
                paddingVertical: 10,
                shadowColor: "black",
                elevation: 10,
              }}
            >
              10 sec
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "100%",
            marginTop: 50,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              tempo(12);
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
                color: cor[3],
                backgroundColor: "white",
                borderRadius: 17,
                borderBottomWidth:1,
                borderRightWidth:2,
                borderColor:"gray",
                paddingHorizontal: 15,
                paddingVertical: 10,
                shadowColor: "black",
                elevation: 10,
              }}
            >
              12 sec
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              tempo(15);
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
                color: cor[4],
                backgroundColor: "white",
                borderRadius: 17,
                borderBottomWidth:1,
                borderRightWidth:2,
                borderColor:"gray",
                paddingHorizontal: 15,
                paddingVertical: 10,
                shadowColor: "black",
                elevation: 10,
              }}
            >
              15 sec
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              tempo(20);
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
                color: cor[5],
                backgroundColor: "white",
                borderRadius: 17,
                borderBottomWidth:1,
                borderRightWidth:2,
                borderColor:"gray",
                paddingHorizontal: 15,
                paddingVertical: 10,
                shadowColor: "black",
                elevation: 10,
              }}
            >
              20 sec
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ width: "100%", alignItems: "center", marginVertical: 20 }}
        >
          <View style={styles.linha} />
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Flashtimer", {
                iddogrupo: route.params.iddogrupo,
                nome: route.params.nome,
                cor: route.params.cor,
                tempo: timer,
              })
            }
          >
            <Text
              style={{
                fontSize: 35,
                fontWeight: "bold",
                backgroundColor: "#fff",
                width: "100%",
                textAlign: "center",
                color: "black",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                shadowColor: "black",
                elevation: 10,
                borderBottomWidth:1,
                borderRightWidth:2,
              }}
            >
              Ok!
            </Text>
          </TouchableOpacity>
        </View>
        </ImageBackground>
      </View>

      <View
        style={{
          backgroundColor: "#A2E3C4",
          width: "100%",
          paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "space-around",
          position: "absolute",
          bottom: 0,
          borderTopLeftRadius:20,
          borderTopRightRadius:20,

        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("home")}
          style={{ width: width * 0.3, alignItems: "center" }}
        >
          <Feather name="home" size={55} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Flashcardslast")}
          style={{ width: width * 0.3, alignItems: "center" }}
        >
<Feather name="zap" size={55} color="black" />

        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("adicionar")}
          style={{ width: width * 0.3, alignItems: "center" }}
        >
          <AntDesign name="pluscircleo" size={55} color="black" />
        </TouchableOpacity>
      </View>
      </ImageBackground>
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

  tempo: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  linha: {
    width: "90%",
    marginTop: 10,
    marginBottom: 10,
    height: 4,
    backgroundColor: "gray",
  },
});
