import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  FlatList,
  Alert,
  Animated,
  ImageBackground,
  Modal,
  SafeAreaView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useCallback } from "react";
// import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

import AnimatedListItem from "./AnimatedListItem";

import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

import papeldeparede from "../assets/pxfuel.jpg";
const db = SQLite.openDatabase("bdflashtimer3.db");

export default function Home({ route, navigation }) {
  const [wallpaper, setwallpaper] = useState(papeldeparede);
  const [image, setImage] = useState(null);
  const [modalvisivel, setmodalvisivel] = useState(false);
   const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();


  const pickImage = async () => {
    
    if(status.granted){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
          console.log(result.assets[result.assets.length - 1].uri);
    setwallpaper({ uri: result.assets[result.assets.length - 1].uri });
    addpapeldeparede(result.assets[result.assets.length - 1].uri);
    }
  }else{
    requestPermission()
  }
  };

  const addpapeldeparede = (i) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO papeldeparede (caminho) values (?);",
        [i],
        (_, result) => {
          console.log("Inserção realizada com sucesso", result);
        },
        (_, error) => {
          console.error("Erro ao inserir dados", error);
        }
      );
    });
    // settituloatual(undefined);
    // navigation.navigate("home");
  };

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


  var resultadoparcial1 = [];
  const [dados, setdados] = useState([]);

  const coletadedados = async () => {
    try {
      resultadoparcial1 = [];

      db.transaction((tx) => {
        tx.executeSql(
          "SELECT id, titulo, cor FROM grupos;",
          [],
          (_, result) => {
            console.log("\n\n\nConsulta realizada com sucesso", result);
            const { rows } = result;
            for (let i = 0; i < rows.length; i++) {
              resultadoparcial1.push({
                id: rows.item(i).id,
                titulo: rows.item(i).titulo,
                cor: rows.item(i).cor,
              });
            }
            setdados(resultadoparcial1);
          },
          (_, error) => {
            console.error("Erro ao consultar dados", error);
          }
        );
      });
    } catch (error) {
      console.log("eh... deu erro");
    }
  };

  const padrao = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM papeldeparede",
        [],
        (txObj, resultSet) => {
          console.log("deletada com sucesso 1");
          setwallpaper(papeldeparede);
        },
        (txObj, error) => console.log("erro ao deletar 1", error)
      );
    });
  };

  const apagar = (i) => {
    var apagando = dados;
    var apagado = [];
    for (let index = 0; index < apagando.length; index++) {
      if (apagando[index].id != i) {
        apagado.push({
          titulo: apagando[index].titulo,
          conteudocard: apagando[index].conteudocard,
          id: apagando[index].id,
          cor: apagando[index].cor,
        });
      }
    }
    setdados(apagado);

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM cards WHERE iddogrupo = ?",
        [i],
        (txObj, resultSet) => {
          console.log("deletada com sucesso 1");
        },
        (txObj, error) => console.log("erro ao deletar 1", error)
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM grupos WHERE id = ?",
        [i],
        (txObj, resultSet) => {
          console.log("deletada com sucesso 2");
        },
        (txObj, error) => console.log("erro ao deletar 2", error)
      );
    });
  };

  const perguntadeletar = (i) => {
    return Alert.alert(
      "VOCÊ QUER APAGAR ESSE GRUPO?",
      "Você tem certeza que quer este grupo?",
      [
        {
          text: "Sim!",
          onPress: () => {
            apagar(i);
          },
        },
        {
          text: "Não!",
        },
      ]
    );
  };



  const [carregado, setccarregado] = useState(false);
  


    useFocusEffect(
    React.useCallback(() => {

      setTimeout(() => {
        coletadedados();
        verificarwpp();
        // TIRAR AQUI DEPOIS DO TESTE DA BUILD

        setccarregado(true)
      }, 500);

    }, [])
  );




  const Item = (i) => {
    function RightActions({ progress, dragX, onPress }) {
      const scale = dragX.interpolate({
        inputRange: [-60, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
      });

      return (
        <TouchableOpacity
          onPress={() => {
            perguntadeletar(i.id);
          }}
          style={styles.rightAction}
        >
          <Animated.View
            style={[
              {
                paddingHorizontal: 15,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              },
              { transform: [{ scale: scale }] },
            ]}
          >
            <FontAwesome name="trash-o" size={50} color="black" />
          </Animated.View>
        </TouchableOpacity>
      );
    }
    return (
      <GestureHandlerRootView>
        <Swipeable
          renderRightActions={(progress, dragX) => (
            <RightActions
              progress={progress}
              dragX={dragX}
              onPress={() => {}}
            />
          )}
        >
          <AnimatedListItem>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  width: "95%",
                  backgroundColor: i.cor,
                  alignItems: "center",
                  justifyContent: "center",
                  borderStyle: "solid",
                  paddingBottom: 10,
                  paddingTop: 2,
                  shadowColor: i.cor,
                  elevation: 10,
                  borderTopLeftRadius: 20,
                  shadowOpacity: 1,
                }}
                onPress={() =>
                  navigation.navigate("listacards", {
                    iddogrupo: i.id,
                    nome: i.titulo,
                    cor: i.cor,
                  })
                }
              >
                <Text
                  style={{
                    fontSize: 19,
                    letterSpacing:1,
                    fontFamily:'Bangers_400Regular',                    width: "90%",
                    textAlign: "left",
                  }}
                >
                  Grupo:
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "80%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        textTransform: "uppercase",
                        verticalAlign: "middle",
                        fontWeight: "700",
                      }}
                    >
                      {i.titulo}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="cards-outline"
                    size={40}
                    color="black"
                    style={{ opacity: 0.2 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </AnimatedListItem>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={wallpaper}
        style={{ width: "100%", height: "100%" }}
        imageStyle={{ opacity: 0.8 }}
      >
        <Text
          style={{
            fontSize: 40,
            fontWeight: "bold",
            marginTop: 10,
            backgroundColor: "#A2E3C4",
            width: "100%",
            textAlign: "center",
            color: "black",
          }}
        >
          SEUS GRUPOS:
        </Text>
        {dados.length > 0 ? (
          <FlatList
            style={{ width: "100%", marginBottom: 80 }}
            data={dados}
            renderItem={({ item }) => Item(item)}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
            }}
          >
            {/* CARD INVISIVEL */}
            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  width: "95%",
                  borderWidth: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  borderStyle: "dotted",
                  paddingBottom: 15,
                  paddingTop: 10,

                  borderTopLeftRadius: 20,
                  shadowOpacity: 1,
                  opacity: 0.4,
                }}
                onPress={() => navigation.navigate("adicionar", {})}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "400",
                    width: "90%",
                    textAlign: "left",
                    color: "black",
                  }}
                >
                  Adicionar Grupo:
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "80%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        textTransform: "uppercase",
                        verticalAlign: "middle",
                        fontWeight: "700",
                        color: "black",
                      }}
                    >
                      Clique aqui criar grupo
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="cards-outline"
                    size={40}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: "white",
                position: "absolute",
                bottom: "50%",
              }}
            >
              Você ainda não possui nenhum grupo salvo...
            </Text>
          </View>
        )}

        <Modal transparent visible={modalvisivel} animationType="slide">
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
                position: "absolute",
              }}
              onTouchStart={() => setmodalvisivel(false)}
            />
            <View
              style={{
                width: width / 1.1,
                height: width / 1.3,
                borderRadius: 10,
                backgroundColor: "#f0f7f4",
                borderTopWidth: 1,
                borderRightWidth: 2,
              }}
            >
              <ImageBackground
                style={{ height: "100%", width: "100%", borderRadius: 10 }}
                source={require("../assets/papel.jpg")}
                imageStyle={{ borderRadius: 10 }}
              >
                <Text
                  style={{
                    fontSize: 35,
                    fontWeight: "bold",
                    marginTop: 20,
                    width: "100%",
                    textAlign: "center",
                    color: "black",
                  }}
                >
                  Trocar{"\n"}papel de parede?
                </Text>

                <View style={{ width: "100%", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setmodalvisivel(false);
                      pickImage();
                    }}
                  >
                    <Text style={styles.botaomodal}>Trocar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setmodalvisivel(false);
                      padrao();
                    }}
                  >
                    <Text style={styles.botaomodal}>Padrão</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setmodalvisivel(false);
                  }}
                  style={{ position: "absolute", right: 5, top: 5 }}
                >
                  <AntDesign name="close" size={30} color="black" />
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </SafeAreaView>
        </Modal>
        {/* IMAGEM */}
        <TouchableOpacity
          onPress={() => setmodalvisivel(true)}
          style={{
            position: "absolute",
            bottom: 100,
            right: 10,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 100,
            opacity: 0.7,
          }}
        >
          <AntDesign name="picture" size={40} color="black" />
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: "#A2E3C4",
            width: "100%",
            paddingVertical: 10,
            flexDirection: "row",
            justifyContent: "space-around",
            position: "absolute",
            bottom: 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
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
