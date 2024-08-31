import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Animated,
  ImageBackground,
  Image,
  Modal,
  TouchableHighlight,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { useState, useRef, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Alert } from "react-native";

import AnimatedListItem from "./AnimatedListItem";

import Swiper from "react-native-swiper";
import FlipCard from "react-native-flip-card";
import { Entypo } from "@expo/vector-icons";
const { width } = Dimensions.get("window");

import papeldeparede from "../assets/pxfuel.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import Timer from "react-native-stopwatch-timer/lib/timer";
export default function Flashcards({ route, navigation }) {
  // const [isTimerStart, setIsTimerStart] = useState(false);
  // const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  // const [timerDuration, setTimerDuration] = useState(90000);
  // const [resetTimer, setResetTimer] = useState(false);
  // const [resetStopwatch, setResetStopwatch] = useState(false);

  const [tempop, settempop] = useState();
  const [flip,setflip]=useState(false)

  const [wallpaper, setwallpaper] = useState(papeldeparede);

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

  const [indexp, setindexp] = useState(route.params.indexcard);
  const [modalvisivel, setmodalvisivel] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scaleAnim } } }],
    { useNativeDriver: false }
  );

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
        "SELECT titulo, conteudo, id, image, imagetitulo FROM cards WHERE iddogrupo=?",
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
              image: rows.item(i).image,
              imagetitulo: rows.item(i).imagetitulo,

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
    for (let index = 0; index < apagando.length; index++) {
      if (apagando[index].id != i) {
        apagado.push({
          titulo: apagando[index].titulo,
          conteudocard: apagando[index].conteudocard,
          id: apagando[index].id,
          paginaatual: index + 1,
          paginatotal: apagado.length - 1,
          image: apagando[index].image,
          imagetitulo: apagando[index].imagetitulo,

        });
      } else {
        setindexp(index-1);
      }
    }

    for (let index = 0; index < apagado.length; index++) {
      apagado[index].paginaatual = index + 1;
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
      verificarwpp();
    }, [])
  );

  const [tempo, settempo] = useState(false);
  const [sec, setsec] = useState(0);
  const [cortimer, setcortimer] = useState("black");
  const addTimer = (tempo) => {
    settempo(true);
    setsec(tempo);
    setcortimer("green");
    setmodalvisivel(false);
  };
                  



  return (
    <View style={styles.container}>
      <ImageBackground
        source={wallpaper}
        style={{ width: "100%", height: "100%" }}
        imageStyle={{ opacity: 0.8 }}
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
              width: "70%",
            }}
          >
            {route.params.nome}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AdicionarFlash", {
                iddogrupo: route.params.iddogrupo,
                nome: route.params.nome,
              });

              setindexp(dados.length);
            }}
            style={{
              width: "13%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Entypo name="documents" size={44} color="green" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setmodalvisivel(true)}
            style={{
              width: "13%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <MaterialCommunityIcons
              name="timer-outline"
              size={44}
              color={cortimer}
            />
          </TouchableOpacity>
        </View>
        <Modal transparent visible={modalvisivel} animationType="slide">
          <SafeAreaView
            style={{
              flex: 1,
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
                height: width / 1.1,
                borderRadius: 10,
                backgroundColor: "#f0f7f4",
                shadowColor: "black",
                elevation: 5,
              }}
            >
              <ImageBackground
                style={{ height: "100%", width: "100%", borderRadius: 10 }}
                source={require("../assets/papel.jpg")}
                imageStyle={{ borderRadius: 10 }}
              >
                <Text
               style={{
                fontSize: 40,
                marginTop: 5,
                width: "100%",
                textAlign: "center",
                color: "black",
                fontFamily:'Bangers_400Regular'
                  }}
                >
                  Timer
                </Text>

                <View style={styles.containertimebutton}>
                  <TouchableOpacity
                    onPress={() => addTimer(4)}
                    style={styles.opacitycontainer}
                  >
                    <Text style={styles.timebutton}>4s</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => addTimer(6)}
                    style={styles.opacitycontainer}
                  >
                    <Text style={styles.timebutton}>6s</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => addTimer(8)}
                    style={styles.opacitycontainer}
                  >
                    <Text style={styles.timebutton}>8s</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.containertimebutton}>
                  <TouchableOpacity
                    onPress={() => addTimer(10)}
                    style={styles.opacitycontainer}
                  >
                    <Text style={styles.timebutton}>10s</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => addTimer(12)}
                    style={styles.opacitycontainer}
                  >
                    <Text style={styles.timebutton}>12s</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={{
                      borderRadius: 8,
                      width: "28%",
                      paddingVertical: 10,
                      backgroundColor: "#A2E3C4",
                      shadowColor: "black",
                      elevation: 8,
                      fontSize: width / 14,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                    keyboardType='number-pad'
                    value={tempop}
                    onChangeText={(number) => {
                      settempop(number);
                    }}
                    maxLength={2}
                  />
                </View>
                <View style={styles.containertimebutton}>
                  {!tempop ? (
                    <TouchableOpacity
                      onPress={() => {
                        settempo(false);
                        setmodalvisivel(false);
                        setcortimer("black");
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: "white",
                          fontSize: width / 14,
                          paddingVertical: 10,
                          paddingHorizontal: 35,
                          borderRadius: 8,
                          shadowColor: "black",
                          elevation: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Limpar
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                    onPress={() => {addTimer(parseInt(tempop))
                       settempop()
                    }}
                    >
                      <Text
                        style={{
                          backgroundColor: "white",
                          fontSize: width / 14,
                          paddingVertical: 10,
                          paddingHorizontal: 35,
                          borderRadius: 8,
                          shadowColor: "black",
                          elevation: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Ok
                      </Text>
                    </TouchableOpacity>
                  )}
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
        {dados.length > 0 ? (
          <Swiper
            loop
            style={{ marginTop: 10 }}
            animated={true}
            index={indexp}
            autoplayTimeout={sec}
            autoplay={tempo}
        
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
                  friction={10}
                  perspective={1000}
                  flipHorizontal={false}
                  flipVertical={true}
                  flip={flip}
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
                            position: "absolute",
                            opacity: 0.5,
                            bottom: 15,
                            right: 15,
                            fontSize: 26,
                          }}
                        >
                          {i.paginaatual}
                        </Text>
                        

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
                        {i.imagetitulo ? (
                          <Image
                            source={{ uri: i.imagetitulo }}
                            style={{
                              width: width / 1.3,
                              height: width / 1.3,
                              borderRadius: 5,
                              borderLeftWidth: 2,
                              borderColor: "black",
                            }}
                          />
                        ) : (
                          <View style={{ display: "none" }} />
                        )}
                      </ImageBackground>
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
                        {i.image ? (
                          <Image
                            source={{ uri: i.image }}
                            style={{
                              width: width / 1.3,
                              height: width / 1.3,
                              borderRadius: 5,
                              borderLeftWidth: 2,
                              borderColor: "black",
                            }}
                          />
                        ) : (
                          <View style={{ display: "none" }} />
                        )}

                        <Text
                          style={{
                            fontSize: 25,
                            textAlign: "center",
                            fontWeight: "bold",
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
                        {tempo ? (
                          <Text
                            style={{
                              position: "absolute",
                              opacity: 0.5,
                              bottom: 15,
                              right: 15,
                              fontSize: 22,
                            }}
                          >
                            {sec}s
                          </Text>
                        ) : (
                          <View style={{ display: "none" }}></View>
                        )}
                      </ImageBackground>
                    </View>
                  </View>
                </FlipCard>
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

  timebutton: {
    fontSize: width / 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  containertimebutton: {
    flexDirection: "row",
    marginTop: 23,
    justifyContent: "space-around",
    width: "100%",
  },

  opacitycontainer: {
    borderRadius: 8,
    width: "28%",
    paddingVertical: 10,
    backgroundColor: "#A2E3C4",
    shadowColor: "black",
    elevation: 8,
  },

  title: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
  },
  sectionStyle: {
    flex: 1,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    marginTop: 10,
  },
});

const options = {
  container: {
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    color: "white",
    marginLeft: 7,
  },
};
