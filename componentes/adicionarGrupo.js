import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Keyboard,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

import papeldeparede from "../assets/pxfuel.jpg";

export default function AdicionarGupo({ route, navigation }) {
  const [wallpaper, setwallpaper] = useState(papeldeparede);

  const [tituloatual, settituloatual] = useState(undefined);
  const db = SQLite.openDatabase("bdflashtimer3.db");
  const [color, setcolor] = useState("#A2E3C4");

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [imageheigth, setimageheigth] = useState("100%");

  useEffect(() => {
    // Adiciona um listener para o evento de exibição do teclado
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        setimageheigth(height);
      }
    );

    // Adiciona um listener para o evento de ocultação do teclado
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setimageheigth('100%');
      }
    );

    // Limpa os listeners quando o componente for desmontado
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);




  
  useEffect(()=>{


    verificarwpp()
  },[])

  const verificarwpp = () =>{
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT caminho FROM papeldeparede;",
        [],
        (_, result) => {
          console.log('papeldeparede');
          console.log("\n\n\nConsulta realizada com sucesso", result);
          const { rows } = result;
        //  console.log(rows._array[rows.length-1].caminho);
         if(rows.length>0){
          setwallpaper({uri:rows._array[rows.length-1].caminho})
         }
         
        },
        (_, error) => {
          console.error("Erro ao consultar dados", error);
        }
      );
    });
  }

  const adicionarNome = () => {
    if (tituloatual) {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO grupos (titulo,cor) values (?,?);",
          [tituloatual, color],
          (_, result) => {
            console.log("Inserção realizada com sucesso", result);
          },
          (_, error) => {
            console.error("Erro ao inserir dados", error);
          }
        );
      });
      settituloatual(undefined);
      navigation.navigate("home");
    } else {
      navigation.navigate("adicionar", { refresh: 1 });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={wallpaper}
        style={{
          height:imageheigth,
          width: "100%",
          backgroundColor: "white",
          alignItems: "center",
        }}
        imageStyle={{ opacity: 0.8 }}
      >
        <Text style={styles.titulo}>Título do Grupo</Text>
        <TextInput
          autoFocus
          maxLength={40}
          value={tituloatual}
          onChangeText={(text) => {
            settituloatual(text);
          }}
          style={styles.TextInput}
        />

        <Text
          style={{
            fontSize: 30,
            marginTop: 10,
            backgroundColor: "#A2E3C4",
            width: "100%",
            textAlign: "center",
            color: "black",
            fontFamily:'Bangers_400Regular',
            letterSpacing:4

          }}
        >
          Paleta de Cores
        </Text>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setcolor("#209093");
            }}
            style={{ width: width / 5.3 }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#209093",
                height: 40,
                borderStyle: "solid",
                borderColor: "black",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setcolor("#59c2c5");
            }}
            style={{ width: width / 5.3 }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#59c2c5",
                height: 40,
                borderStyle: "solid",
                borderColor: "black",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setcolor("#40957f");
            }}
            style={{ width: width / 5.3 }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#40957f",
                height: 40,
                borderStyle: "solid",
                borderColor: "black",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setcolor("#a7c686");
            }}
            style={{ width: width / 5.3 }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#a7c686",
                height: 40,
                borderStyle: "solid",
                borderColor: "black",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setcolor("#fcee8c");
            }}
            style={{ width: width / 5.3 }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#fcee8c",
                height: 40,
                borderColor: "black",
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setcolor("#ffe7bf");
            }}
            style={{ width: width / 5.3 }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#ffe7bf",
                height: 40,
                borderStyle: "solid",
                borderColor: "black",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setcolor("#ffc978");
            }}
            style={{ width: width / 5.3 }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#ffc978",
                height: 40,
                borderStyle: "solid",
                borderColor: "black",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setcolor("#c9c987");
            }}
            style={{ width: width / 5.3 }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#c9c987",
                height: 40,
                borderStyle: "solid",
                borderColor: "black",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setcolor("#d1a664");
            }}
            style={{ width: width / 5.3 }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#d1a664",
                height: 40,
                borderStyle: "solid",
                borderColor: "black",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setcolor("#c27b57");
            }}
            style={{ width: width / 5.3 }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#c27b57",
                height: 40,
                borderStyle: "solid",
                borderColor: "black",
              }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={adicionarNome}
          style={{
            width: "70%",
            margin: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: color,
              borderRadius: 15,
              alignItems: "center",
              borderStyle: "solid",
              borderColor: "black",
              elevation:5,
              shadowColor:'black'
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontFamily:'Bangers_400Regular',
                color: "black",
                textAlign:'center',
                width:'100%'
              }}
            >
              Pronto!
            </Text>
          </View>
        </TouchableOpacity>

        {!isKeyboardVisible ? (
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
              <Feather name="zap" size={55} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("adicionar")}
              style={{ width: width * 0.3, alignItems: "center" }}
            >
              <AntDesign name="pluscircleo" size={55} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ display: "none" }} />
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
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
    fontSize: 35,
    marginTop: 10,
    backgroundColor: "#A2E3C4",
    width: "100%",
    textAlign: "center",
    color: "black",
    fontFamily:'Bangers_400Regular',
    letterSpacing:2,

  },

  TextInput: {
    backgroundColor: "#d2d2d2",
    width: "95%",
    marginTop: 10,
    fontSize: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: "500",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: 8,
  },
});
