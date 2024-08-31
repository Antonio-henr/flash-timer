import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Alert,
  ScrollView,
  ImageBackground,
  Image,
  SafeAreaView,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { FontAwesome } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { EvilIcons } from '@expo/vector-icons';
import papeldeparede from "../assets/pxfuel.jpg";

import * as ImagePicker from "expo-image-picker";

const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");

export default function AdicionarFlash({ route, navigation }) {
  const [image2, setimage2] = useState();
  const [image, setimage] = useState();
  const [imagesql, setimagesql] = useState("");
  const [imagesql2, setimagesql2] = useState("");

  const [modalvisivel, setmodalvisivel] = useState(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const pickImage = async (imgselec) => {
    // No permissions request is necessary for launching the image library

    if (status.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // setimage(result.assets[0].uri);
        console.log(result.assets[result.assets.length - 1].uri);

        if (imgselec == 0) {
          setimage({ uri: result.assets[result.assets.length - 1].uri });
          setimagesql(result.assets[result.assets.length - 1].uri);
        } else if (imgselec == 1) {
          setimage2({ uri: result.assets[result.assets.length - 1].uri });
          setimagesql2(result.assets[result.assets.length - 1].uri);
        }
      } else {
        // setimage();
      }
    } else {
      requestPermission();
    }
  };

  const [wallpaper, setwallpaper] = useState(papeldeparede);

  useFocusEffect(
    React.useCallback(() => {
      verificarwpp();
    }, [])
  );

  const verificarwpp = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT caminho FROM papeldeparede;",
        [],
        (_, result) => {
          console.log("papeldeparede");
          console.log("\n\n\nConsulta realizada com sucesso", result);
          const { rows } = result;
          //  console.log(rows._array[rows.length-1].caminho);
          if (rows.length > 0) {
            setwallpaper({ uri: rows._array[rows.length - 1].caminho });
          }
        },
        (_, error) => {
          console.error("Erro ao consultar dados", error);
        }
      );
    });
  };

  const [titulodoflash, settitulodoflash] = useState("");
  const [textolodoflash, settextodoflash] = useState("");

  const window = useWindowDimensions();

  const db = SQLite.openDatabase("bdflashtimer3.db");

  console.log(route.params.iddogrupo);

  const adicionarflashcard = async () => {
    if (titulodoflash != "") {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO cards (titulo, conteudo, iddogrupo, image, imagetitulo) values (?,?,?,?,?);",
          [titulodoflash, textolodoflash, route.params.iddogrupo, imagesql, imagesql2],
          (_, result) => {
            console.log("Inserção realizada com sucesso", result);
          },
          (_, error) => {
            console.error("Erro ao inserir dados", error);
          }
        );
      });
      settitulodoflash("");
      settextodoflash("");
      setimagesql("");
      setimagesql2("");
      setimage2();
      setimage();

      setmodalvisivel(true);
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  };

  
  return (
    <ImageBackground
      source={wallpaper}
      style={{ width: "100%", height: height }}
      imageStyle={{ opacity: 0.8 }}
    >
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "300",
              textTransform: "uppercase",
              marginTop: 5,
            }}
          >
            {route.params.nome}
          </Text>

          <Text style={styles.titulo}>TÍTULO DO CARD</Text>
          <TextInput
            maxLength={40}
            value={titulodoflash}
            onChangeText={(text) => {
              settitulodoflash(text);
            }}
            style={styles.TituloFlash}
          />


          {/* IMAGEM 2 */}
          <TouchableOpacity
            onPress={() => pickImage(1)}
            style={{
              backgroundColor: "white",
              marginTop: 10,
              padding: 10,
              width: "95%",
              borderRadius: 5,
              opacity: 0.7,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {image2 ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Image
                  source={image2}
                  style={{ width: "20%", aspectRatio: 1 }}
                />
                <Text style={{ width: "60%" }} numberOfLines={2}>
                  {imagesql}
                </Text>
                <EvilIcons onPress={()=>{setimage2(); setimagesql2()}} name="trash" size={50} color="black" />
              </View>
            ) : (
              <AntDesign name="picture" size={50} color="black" />
            )}
          </TouchableOpacity>

          <View style={styles.linha} />
          <Text style={styles.titulo2}>CONTEÚDO</Text>

          <TextInput
            maxLength={200}
            value={textolodoflash}
            onChangeText={(text) => {
              settextodoflash(text);
            }}
            numberOfLines={3}
            multiline
            style={styles.TextoFlash}
          />

          {/* IMAGEM */}

          <TouchableOpacity
            onPress={() => pickImage(0)}
            style={{
              backgroundColor: "white",
              marginTop: 10,
              padding: 10,
              width: "95%",
              borderRadius: 5,
              opacity: 0.7,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {image ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Image
                  source={image}
                  style={{ width: "20%", aspectRatio: 1 }}
                />
                <Text style={{ width: "60%" }} numberOfLines={2}>
                  {imagesql}
                </Text>
                <EvilIcons onPress={()=>{setimage(); setimagesql()}} name="trash" size={50} color="black" />
                
              </View>
            ) : (
              <AntDesign name="picture" size={50} color="black" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={adicionarflashcard}
            style={{
              width: "70%",
              margin: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#31B280",
                borderRadius: 15,
                alignItems: "center",
                borderStyle: "solid",
                borderColor: "black",
                elevation: 5,
                shadowColor: "black",
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: "Bangers_400Regular",
                  color: "black",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Pronto!
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Modal transparent visible={modalvisivel} animationType="fade">
          <SafeAreaView
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#00000033",
                position: "absolute",
              }}
              onTouchStart={() => setmodalvisivel(false)}
            />
            <View
              style={{
                padding: 25,
                borderRadius: 100,
                backgroundColor: "#A2E3C4",
                shadowColor: "black",
                elevation: 5,
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign
                  name="checkcircleo"
                  size={60}
                  color="black"
                  style={{ shadowColor: "black", elevation: 5 }}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    // flex:1
  },

  textarea: {
    borderColor: "black",
    borderWidth: 2,
    textAlign: "center",
    fontSize: 20,
    borderStyle: "solid",
    width: "95%",
    height: 40,
  },

  linha: {
    width: "90%",
    marginTop: 10,
    marginBottom: 10,
    height: 3,
    backgroundColor: "gray",
  },

  titulo: {
    fontSize: 37,
    marginTop: 10,
    backgroundColor: "#A2E3C4",
    width: "95%",
    textAlign: "center",
    color: "black",
    fontFamily: "Bangers_400Regular",
    letterSpacing: 3,
  },

  titulo2: {
    fontSize: 30,
    marginTop: 10,
    backgroundColor: "#A2E3C4",
    width: "95%",
    textAlign: "center",
    color: "black",
    fontFamily: "Bangers_400Regular",
    letterSpacing: 4,
  },

  TituloFlash: {
    backgroundColor: "#d2d2d2",
    width: "95%",
    marginTop: 10,
    fontSize: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: "400",
    shadowColor: "black",
    elevation: 8,
  },

  TextoFlash: {
    backgroundColor: "#d2d2d2",
    width: "95%",
    marginTop: 10,
    fontSize: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: "400",
    textAlign: "left",
    textAlignVertical: "top",
    shadowColor: "black",
    elevation: 8,
  },
});
