import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Animated,
  ImageBackground,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { useState, useRef, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Dimensions } from "react-native";
import { Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnimatedListItem from "./AnimatedListItem";

import { Swipeable, gestureHandlerRootHOC } from "react-native-gesture-handler";

import { Entypo } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

import papeldeparede from "../assets/pxfuel.jpg";

export default function Listaflash({ route, navigation }) {
  const db = SQLite.openDatabase("bdflashtimer3.db");

  const [wallpaper, setwallpaper] = useState(papeldeparede);

  // useEffect(() => {
  //   verificarwpp();
  // }, []);

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

  const scaleAnim = useRef(new Animated.Value(1)).current;

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
        "SELECT titulo, conteudo, id FROM cards WHERE iddogrupo=?",
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
              paginaatual: i,
              paginatotal: rows.length,
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
          paginaatual: index,
          paginatotal: apagado.length - 1,
        });
      }
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
      "VOCÊ QUER APAGAR?",
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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     coletadedados();
  //   }, [])
  // );



  useFocusEffect(
    React.useCallback(() => {

         verificarwpp();
        coletadedados();
 

    }, [])
  );




  const Item = gestureHandlerRootHOC((i, k) => (
    <Swipeable>
      <AnimatedListItem>
        <View
          style={{
            width: "100%",
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: "95%",
              backgroundColor: route.params.cor,
              alignItems: "center",
              justifyContent: "center",
              borderColor: "gray",
              borderStyle: "solid",
              // borderRadius: 15,
              borderBottomEndRadius: 0,
              borderRightWidth: 1,
              borderBottomWidth: 2,

              paddingBottom: 10,
              shadowColor: "black",
              elevation: 4,
            }}
            onPress={() =>
              navigation.navigate("flashcards", {
                iddogrupo: route.params.iddogrupo,
                nome: route.params.nome,
                cor: route.params.cor,
                indexcard: i.paginaatual,
              })
            }
          >
            <MaterialCommunityIcons
              name="arrow-expand"
              size={28}
              color="black"
              style={{ position: "absolute", right: 10, opacity: 0.6 }}
            />

            <Text
              style={{
                fontSize: 20,
                width: "90%",
                textAlign: "left",
                fontFamily:'Bangers_400Regular',

              }}
            >
              Card:
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "95%",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  textTransform: "uppercase",
                  verticalAlign: "middle",
                  fontWeight: "700",
                  marginBottom:2,
                  width: "90%",
                }}
              >
                - {i.titulo}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </AnimatedListItem>
    </Swipeable>
  ));

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
          <FlatList
            style={{ width: "100%", marginBottom: 80 }}
            data={dados}
            renderItem={({ item, index }) => Item(item, index)}
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
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  width: "95%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderStyle: "dotted",
                  borderColor: "black",
                  paddingVertical: 5,
                  borderWidth: 2,
                  borderRadius:5,
                  opacity:0.4
                }}
                onPress={() =>
                  navigation.navigate("AdicionarFlash", {
                    iddogrupo: route.params.iddogrupo,
                    nome: route.params.nome,
                  })
                }
              >
                <MaterialCommunityIcons
                  name="arrow-expand"
                  size={28}
                  color="black"
                  style={{ position: "absolute", right: 10, }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "95%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 23,
                      verticalAlign: "middle",
                      marginTop: 2,
                      marginBottom: 5,
                      width: "90%",
                      color: "black",
                    }}
                  >
                    Clique aqui para adiconar{"\n"}um novo card
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* TEXTO */}
            <View
              style={{
                position: "absolute",
                top: "40%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 500,
                  color: "white",
                  textAlign: "center",
                }}
              >
                Você ainda não possui nenhum card salvo neste grupo...
              </Text>
        
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
