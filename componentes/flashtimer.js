import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ImageBackground,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useRef, useEffect } from "react";
import { Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Alert } from "react-native";
import Swiper from "react-native-swiper";
import { Image } from "react-native";
import { Entypo } from "@expo/vector-icons";

import FlipCard from "react-native-flip-card";

const { width } = Dimensions.get("window");

import wallpaper from "../assets/wallpaper8.jpeg";

export default function Flashtimer({ route, navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const db = SQLite.openDatabase("bdflashtimer3.db");
  var identificacao = 0;
  if (route.params.iddogrupo) {
    identificacao = route.params.iddogrupo;
  }

  var resultadoparcial = [];
  const [dados, setdados] = useState([]);

  const coletadedados = () => {
    resultadoparcial = [];
    console.log("identificacao", identificacao);

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT titulo, conteudo,imagem, id FROM cards WHERE iddogrupo=?",
        [identificacao],
        (_, result) => {
          console.log("\n\n\nConsulta 2 realizada com sucesso", result);
          const { rows } = result;
          console.log(result);
          for (let i = 0; i < rows.length; i++) {
            resultadoparcial.push({
              titulo: rows.item(i).titulo,
              conteudocard: rows.item(i).conteudo,
              id: rows.item(i).id,
              paginaatual: i + 1,
              paginatotal: rows.length,
              imagem: rows.item(i).imagem,
            });
          }
          setdados(resultadoparcial);
        },
        (_, error) => {
          console.error("Erro 2 ao consultar dados", error);
        }
      );
    });
  };

  const apagar = (i) => {
    var apagando = dados;
    var apagado = [];

    for (let w = 0; w < apagando.length; w++) {
      if (apagando[w].id != i) {
        apagado.push({
          titulo: apagando[w].titulo,
          conteudocard: apagando[w].conteudocard,
          id: apagando[w].id,
          paginaatual: apagado + 1,
          paginatotal: apagando.length - 1,
          imagem: apagando[w].imagem,
        });
      } else {
        flatListRef.current.scrollBy(0);

        console.log("deu certo");
      }
    }

    for (let j = 0; j < apagado.length; j++) {
      apagado[j].paginaatual = j + 1;
    }
    setdados(apagado);

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM cards WHERE id = ?",
        [i],
        (txObj, resultSet) => {
          console.log("deletada com sucesso");
        },
        (txObj, error) => console.log("erro ao deletar", error)
      );
    });
  };

  const perguntadeletar = (i) => {
    return Alert.alert(
      "VOCÊ QUER APAGAR CAR?",
      "Você tem certeza que quer este flash-cards?",
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

  useFocusEffect(
    React.useCallback(() => {
      coletadedados();
    }, [])
  );

  const flatListRef = useRef(null);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={wallpaper}
        style={{ width: "100%", height: "100%" }}
        imageStyle={{ opacity: 0.7 }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 40,
              fontWeight: 300,
              textAlign: "center",
              width: "85%",
            }}
          >
            {route.params.nome}{" "}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AdicionarFlash", {
                iddogrupo: route.params.iddogrupo,
                nome: route.params.nome,
              })
            }
          >
            <Entypo name="documents" size={40} color="green" />
          </TouchableOpacity>
        </View>

        {dados.length > 0 ? (
          <Swiper
            loop
            autoplay
            style={{ marginTop: 10 }}
            animated={true}
            autoplayTimeout={route.params.tempo}
            index={2}
            ref={flatListRef}
          >
            {dados.map((i, index) => (
              <View
                key={index}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "82%",
                  paddingTop: 15,
                }}
              >
                <FlipCard
                  style={{ width: width, height: "100%" }}
                  friction={6}
                  perspective={1000}
                  flipHorizontal={true}
                  flipVertical={false}
                  flip={false}
                  clickable={true}
                  onFlipEnd={(isFlipEnd) => {
                    console.log("isFlipEnd", isFlipEnd);
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "95%",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: route.params.cor,
                        width: "95%",
                        height: "100%",
                        borderBlockColor: "black",
                        alignItems: "center",
                        borderRadius: 10,
                        justifyContent: "center",
                        borderWidth: 1,
                      }}
                    >
                      <ImageBackground
                        style={{
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          borderRadius: 11,
                          justifyContent: "center",
                        }}
                        source={require("../assets/papel.jpg")}
                        imageStyle={{ opacity: 0.3 }}
                      >
                        <TouchableOpacity
                          style={{ position: "absolute", top: 10, right: 10 }}
                          onPress={() => {
                            perguntadeletar(i.id);
                          }}
                        >
                          <FontAwesome name="trash-o" size={40} color="black" />
                        </TouchableOpacity>
                        <AntDesign
                          style={{
                            position: "absolute",
                            opacity: 0.5,
                            bottom: 10,
                            left: 10,
                          }}
                          name="swap"
                          size={40}
                          color="black"
                        />

                        <Text
                          style={{
                            fontSize: 27,
                            marginTop: 10,
                            fontWeight: "400",
                            width: "80%",
                            paddingVertical: 8,
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}
                        >
                          {i.titulo}
                        </Text>
                      </ImageBackground>
                    </View>
                    <View
                      style={{
                        width: "85%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ textAlign: "center", fontSize: 20 }}>
                        {i.paginaatual}/{i.paginatotal}
                      </Text>
                      <Text style={{ textAlign: "center", fontSize: 20 }}>
                        {route.params.tempo} sec
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      height: "95%",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: route.params.cor,
                        width: "95%",
                        height: "100%",
                        borderBlockColor: "black",
                        alignItems: "center",
                        borderRadius: 10,
                        justifyContent: "center",
                        borderWidth: 1,
                      }}
                    >
                      <ImageBackground
                        style={{
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          borderRadius: 11,
                          justifyContent: "center",
                        }}
                        source={require("../assets/papel.jpg")}
                        imageStyle={{ opacity: 0.3 }}
                      >
                        {i.imagem ? (
                          <Image
                            source={{ uri: i.imagem }}
                            style={{
                              width: width / 1.7,
                              height: width / 1.7,
                              borderRadius: 5,
                            }}
                          />
                        ) : (
                          <View></View>
                        )}
                        <Text
                          style={{
                            fontSize: 25,
                            textAlign: "center",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            marginTop: 2,
                            color: "black",
                          }}
                          numberOfLines={6}
                        >
                          {i.conteudocard}
                        </Text>
                        <View style={styles.linha}></View>
                        <Text
                          style={{
                            color: "black",
                            top: 10,
                            fontSize: 20,
                            fontWeight: "bold",
                            opacity: 0.3,
                            position: "absolute",
                          }}
                        >
                          RESPOSTA:
                        </Text>
                      </ImageBackground>
                    </View>
                  </View>
                </FlipCard>
                {/* <View
                style={{
                  backgroundColor: route.params.cor,
                  width: "95%",
                  height: "100%",
                  borderBlockColor: "black",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-around",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      marginTop: 10,
                      fontWeight: "400",
                      width: "80%",
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      borderBottomLeftRadius: 20,
                      paddingVertical: 8,
                      textAlign: "center",
                      textTransform: "uppercase",
                      borderStyle: "solid",
                      borderWidth: 2,
                      borderColor: "black",
                    }}
                  >
                    {i.titulo}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      perguntadeletar(i.id);
                    }}
                  >
                    <FontAwesome name="trash-o" size={40} color="black" />
                  </TouchableOpacity>
                </View>

                <View style={styles.linha} />
                <View
                  style={{
                    width: "97%",
                    justifyContent: "center",
                    height: "85%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      marginTop: 2,
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    {i.conteudocard}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "85%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ textAlign: "center", fontSize: 20 }}>
                  {i.paginaatual}/{i.paginatotal}
                </Text>
                <Text style={{ textAlign: "center", fontSize: 20 }}>
                  {route.params.tempo} sec
                </Text>
              </View> */}
              </View>
            ))}
          </Swiper>
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: "gray",
                textAlign: "center",
              }}
            >
              Você ainda não possui nenhum card salvo neste grupo...
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 500,
                  color: "gray",
                  textAlign: "center",
                }}
              >
                clique aqui{"  "}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AdicionarFlash", {
                    iddogrupo: route.params.iddogrupo,
                    nome: route.params.nome,
                  })
                }
              >
                <Entypo name="documents" size={40} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        )}

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
            <Feather name="home" size={55} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Flashcardslast")}
            style={{ width: width * 0.3, alignItems: "center" }}
          >
            <Feather name="zap" size={55} color="white" />
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
  },

  linha: {
    width: "25%",
    marginTop: 10,
    marginBottom: 10,
    height: 3,
    backgroundColor: "gray",
  },

  listItem: {
    width: width,
    height: "75%",
    alignItems: "center",
    marginTop: 20,
  },
});
