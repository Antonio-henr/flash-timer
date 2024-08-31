import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./componentes/home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Flashcards from "./componentes/flashcards";
import AdicionarGupo from "./componentes/adicionarGrupo";
import AdicionarFlash from "./componentes/adicionarFlash";
import React, { useState } from "react";
import * as SQLite from "expo-sqlite";
import Flashcardslast from "./componentes/flashcardlast";
import Listaflash from "./componentes/listaflash";
import { useEffect } from "react";
import Teste from "./componentes/teste";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Acme_400Regular, useFonts } from "@expo-google-fonts/acme";
import { Bangers_400Regular } from "@expo-google-fonts/bangers";
import { Caveat_700Bold } from "@expo-google-fonts/caveat";

const Tab = createBottomTabNavigator();


const Stack = createNativeStackNavigator();
const db = SQLite.openDatabase("bdflashtimer3.db");

export default function App() {


let [fontsLoaded] = useFonts({
  Acme_400Regular,
  Bangers_400Regular,
  Caveat_700Bold
});

if (!fontsLoaded) {
  return(
<Text>Loading...</Text>  )  

}

  const iniciarbancodedados = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS grupos (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, cor TEXT)",
        [],
        (_, result) => {
          console.log("Tabela 1 criada com sucesso", result);
          // Alert.alert('sucesso 1')
        },
        (_, error) => {
          console.error("Erro 1 ao criar tabela", error);
          // Alert.alert('erro 1')

        }
      );

      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT,iddogrupo NUMBER, titulo TEXT, conteudo TEXT, image TEXT, imagetitulo TEXT)",
        [],
        (_, result) => {
          console.log("Tabela 2 criada com sucesso", result);
          // Alert.alert('sucesso 2')

        },
        (_, error) => {
          console.error("Erro 2 ao criar tabela", error);
          // Alert.alert('erro 2')

        }
      );

      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS papeldeparede (id INTEGER PRIMARY KEY AUTOINCREMENT, caminho TEXT)",
        [],
        (_, result) => {
          console.log("Tabela 3 criada com sucesso", result);
          // Alert.alert('sucesso 3')

        },
        (_, error) => {
          console.error("Erro 3 ao criar tabela", error);
          // Alert.alert('erro 3')

        }
      );
    });
  };

  // db.transaction((tx) => {
  //   tx.executeSql(
  //     "CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT,iddogrupo NUMBER, titulo TEXT, conteudo TEXT, image TEXT)",
  //     [],
  //     (_, result) => {
  //       console.log("Tabela 2 criada com sucesso", result);
  //     },
  //     (_, error) => {
  //       console.error("Erro 2 ao criar tabela", error);
  //     }
  //   );
  // });
  // console.log("oi");

  // db.transaction((tx) => {
  //   tx.executeSql(
  //     "CREATE TABLE IF NOT EXISTS papeldeparede (id INTEGER PRIMARY KEY AUTOINCREMENT, caminho TEXT)",
  //     [],
  //     (_, result) => {
  //       console.log("Tabela 3 criada com sucesso", result);
  //     },
  //     (_, error) => {
  //       console.error("Erro 3 ao criar tabela", error);
  //     }
  //   );
  // });

        iniciarbancodedados();
  

  return (
    <NavigationContainer>
      <StatusBar hidden={true} />

      {/* <View style={styles.container}></View> */}
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen
            name="home"
            component={Home}
            options={{
              headerTitleAlign: "center",
              title: " Flash-Timer ",
          
              
              headerStyle: {
                backgroundColor: "#A2E3C4",
                
              },
              headerTitleStyle: { fontSize:40, fontFamily:'Bangers_400Regular' },
            }}
          />

        {/* <Stack.Screen
          name="teste"
          component={Teste}
        /> */}

        <Stack.Screen
            name="flashcards"
            component={Flashcards}
            options={{
              headerTitleAlign: "center",
              title: " Flash-Cards ",
              headerStyle: {
                backgroundColor: "#A2E3C4",
              },
              headerTitleStyle: { fontSize:30, fontFamily:'Bangers_400Regular' },
            }}
            
          />
          <Stack.Screen
            name="adicionar"
            component={AdicionarGupo}
            options={{
              headerBackVisible: false,
              headerTitleAlign: "center",
              title: " Criar Grupo ",
              headerStyle: {
                backgroundColor: "#A2E3C4",
              },
              tabBarHideOnKeyboard: true,
              headerTitleStyle: { fontSize:30, fontFamily:'Bangers_400Regular'},
            }}
          />
      

          <Stack.Screen
            name="AdicionarGrupo"
            component={AdicionarGupo}
            options={{
              headerTitleAlign: "center",
              title: " Criar Grupo ",
              headerStyle: {
                backgroundColor: "#A2E3C4",
              },
              headerTitleStyle: { fontSize:30, fontFamily:'Bangers_400Regular'},
            }}
          />

          <Stack.Screen
            name="AdicionarFlash"
            component={AdicionarFlash}
            options={{
              headerTitleAlign: "center",
              title: " Adicionar Card ",
              headerStyle: {
                backgroundColor: "#A2E3C4",
              },
              headerTitleStyle: { fontSize:30, fontFamily:'Bangers_400Regular'},
            }}
          />

          <Stack.Screen
            name="Flashcardslast"
            component={Flashcardslast}
            options={{
              headerTitleAlign: "center",
              title: " Último Grupo ",
              headerStyle: {
                backgroundColor: "#A2E3C4",
              },
              headerTitleStyle: { fontSize:30, fontFamily:'Bangers_400Regular'},
            }}
          />

          <Stack.Screen
            name="listacards"
            component={Listaflash}
          
            options={{
              headerTitleAlign: "center",
              title: " Lista de Cards ",
            
              
              headerStyle: {
                backgroundColor: "#A2E3C4",
              
              },
              headerTitleStyle: { fontSize:30, fontFamily:'Bangers_400Regular' },
            }}
          /> 
      </Stack.Navigator>

    
        </NavigationContainer>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});


