import { StatusBar } from 'expo-status-bar';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import  firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import NetInfo from '@react-native-community/netinfo';
//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';



// CONFIGURANDO VARIÁVEL DE CONEXÃO COM O FIREBASE

let firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
}

// INICIA O FIREBASE  export default

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}



export default class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
        Portao: '',
        valor: '',
        distanciaAbertura: '',
        };
      
    let firebaseConfig = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
        };

    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
      }
}


   // PEGANDO VALORES DO BANCO DE DADOS

   componentDidMount(){
    firebase.database().ref("Portao/estado").on('value', (snapshot)=> {
        let Portao = snapshot.val() //poderia já setar o state aqui.)
            this.setState({
                      statePortao: Portao,
            }) 
        })

    firebase.database().ref("Abertura/valor").on('value', (snapshot)=> {
        let ValorAbertura = snapshot.val() //poderia já setar o state aqui.)
        ValorAbertura = ValorAbertura / 100
            this.setState({
                Abertura: ValorAbertura,
                distanciaAbertura: ValorAbertura * 60,
            }) 
        })
    
    firebase.database().ref("UnidadeMedida").on('value', (snapshot)=> {
        let UnidadeSingular = snapshot.val() //poderia já setar o state aqui.)
            this.setState({
                singular: UnidadeSingular,
                plural: `${UnidadeSingular}s`
            }) 
        })

    firebase.database().ref("controle/estado").on('value', (snapshot)=> {
        let controle = snapshot.val() //poderia já setar o state aqui.)
        this.setState({
          controlValue: controle
        })
        })

    firebase.database().ref("pedestre/estado").on('value', (snapshot)=> {
      let pedestreDado = snapshot.val() //poderia já setar o state aqui.)
      this.setState({
        pedestreValue: pedestreDado
      })
      })

      firebase.database().ref("motocicletas/estado").on('value', (snapshot)=> {
        let motocicletasDado = snapshot.val() //poderia já setar o state aqui.)
        this.setState({
          motoValue: motocicletasDado
        })
        })

      firebase.database().ref("verificar/").on('value', (snapshot)=> {
        let response = snapshot.val() //poderia já setar o state aqui.)
        this.setState({
          resposta: response
        })
        })

        NetInfo.fetch().then(state => {
          let conec = state.isConnected
          this.setState({
            conect : conec
          })
          
        });
      
    }
        

// DEFININDO AS FUNÇÕES DOS BOTÕES PRINCIPAIS

  acionar = () => {
      firebase.database().ref('controle/').set({
        estado: 'on',
      })
      firebase.database().ref('controle/estado').onDisconnect().set('off');
    }
            
  LongPress = () => {
    firebase.database().ref('LongPress/').set({
      estado: 'on',
    });
    firebase.database().ref('LongPress/estado').onDisconnect().set('off');
  }

  pedestre = () => {
    firebase.database().ref('pedestre/').set({
      estado: 'on',
    });
    firebase.database().ref('pedestre/estado').onDisconnect().set('off');
  }
            
  motocicletas = () => {
      firebase.database().ref('motocicletas/').set({
        estado: 'on',
      });
      firebase.database().ref('motocicletas/estado').onDisconnect().set('off');
    }


render() {

  const { statePortao, Abertura, singular, plural, controlValue, pedestreValue, motoValue, conect } = this.state; //usando a desestruturação
  let animaPortao = Abertura * 100

  this.state = {
    Botao: {
      backgroundColor: controlValue == "off" ? '#FFFFFF' : 'rgba(255, 77, 77, 0.479)',
      //borderColor: controlValue == 'off' ? '#474954' : '#FF3647',
      borderColor: '#474954',
      borderWidth: 5,
      width: 200,
      height: 200,
      textAlign: 'center',
      fontSize: 20,
      borderRadius: 100,
    },
    botaoMenor: {
      backgroundColor: pedestreValue == 'off' ? '#FFFFFF' : 'rgba(255, 77, 77, 0.479)',
      borderColor: '#474954',
      borderWidth: 3,
      width: 100,
      height: 100,
      textAlign: 'center',
      fontSize: 20,
      borderRadius: 100,
      marginTop: 10,
      marginRight: 140,
    },
    botaoMenor2: {
      backgroundColor: motoValue == 'off' ? '#FFFFFF' : 'rgba(255, 77, 77, 0.479)',
      borderColor: '#474954',
      borderWidth: 3,
      width: 100,
      height: 100,
      textAlign: 'center',
      fontSize: 20,
      borderRadius: 100,
      marginTop: -100,
      marginRight: -130,
    },
    numeroAbertura: Abertura <=0 ? '' : Abertura,
    unidadeMedida:  Abertura <=0 ? '' : Abertura < 1.01 ? singular : plural,
    estadoDoPortao: {
      fontSize: 35,
      color: statePortao == 'Aberto' ? '#5adbff' : '#474954'
    }
  }

  return (

    conect == true  ? ( // TESTANDO SE TEM CONEXÃO
    <View style={styles.container}>


<Image source={require('./assets/gcarfelogo.png')} style={styles.imgLogo}/>
      
      <StatusBar style="auto" />


    <View style={styles.sensor}>
      <Text style={this.state.estadoDoPortao}>{statePortao}</Text>
      <View style={styles.BarraUm}></View>
      <View style={styles.BarraDois}></View>
      <View 
      style={
        {
          width: 260,
          height: 35,
          borderColor: '#5adbff',
          borderWidth: 2,
          left: animaPortao < 2 ? 0 : animaPortao < 4 ? 2 : animaPortao < 6 ? 3 : animaPortao < 8 ? 4.5 : animaPortao < 10 ? 5.6 : animaPortao < 20 ? 8 : animaPortao < 30 ? 16 : animaPortao < 40 ? 22 : animaPortao < 50 ? 29 : animaPortao <
          60 ? 35 : animaPortao < 70 ? 41 : animaPortao < 80 ? 47 : animaPortao < 90 ? 53 : animaPortao < 100 ? 59 : animaPortao < 110 ? 67 : animaPortao < 120 ? 74 : animaPortao <
          130 ? 79 : animaPortao < 140 ? 85 : animaPortao < 150 ? 89 : animaPortao < 160 ? 94 : animaPortao < 170 ? 100 : animaPortao < 180 ? 105 : animaPortao < 190 ? 110 : animaPortao <
          200 ? 115 : animaPortao < 210 ? 126 : animaPortao < 220 ? 129 : animaPortao < 230 ? 134 : animaPortao < 240 ? 139 : animaPortao < 250 ? 143 : animaPortao < 260 ? 149 : animaPortao <
           270 ? 155 : animaPortao < 280 ? 160 : animaPortao < 290 ? 165 : animaPortao < 300 ? 171 : animaPortao < 310 ? 170 : animaPortao < 320 ? 180 : animaPortao < 330 ? 193 : animaPortao
            < 340 ? 200 : animaPortao < 350 ? 213 : animaPortao < 360 ? 219 : animaPortao < 370 ? 227 : animaPortao < 380 ? 234 : animaPortao < 390 ? 240 : animaPortao <= 400 ? 243 : 257,
          backgroundColor: '#474954',
          display: 'flex'
        }
      }
       // ANIMAÇÃO 1 -> METRAGEM 1.56
      // ANIMAÇÃO 0.64 -> METRAGEM 1
      ></View>
      <Text style={styles.info}>{this.state.numeroAbertura} <Text style={styles.unidadeMedida}>{this.state.unidadeMedida}</Text></Text>
    </View>
      


    <View style={styles.Botoes}>
      <TouchableOpacity style={this.state.Botao}
      title="Acionar"
      onPress={this.acionar}
      onLongPress={this.LongPress}>
        
        <Image source={require('./assets/playButton.png')} style={styles.imgPlay}/>
      </TouchableOpacity>


      <TouchableOpacity style={this.state.botaoMenor}
      title="Pedestres"
      onPress={this.pedestre}
      >
         <Image source={require('./assets/pedestre.png')} style={styles.imgPedestre}/>
      </TouchableOpacity>


      <TouchableOpacity style={this.state.botaoMenor2}
      title="Motocicletas"
      onPress={this.motocicletas}
      >
        <Image source={require('./assets/moto.png')} style={styles.imgMoto}/>
      </TouchableOpacity>
    </View>
    

    </View>) : // SE NÃO TIVER CONEXÃO VAI MOSTRAR ESSE OUTRO RENDER
    
    <View style={{    flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>

    <Image source={require('./assets/gcarfelogo.png')} style={{height: 140, width: 140, marginTop: 0, top: -160}}/>

      <Text style={{fontSize: 35, color: '#474954',}}>
        Sem Conexão!
      </Text>

      <Text>
        Verifique a internet e reinicie o App
      </Text>

    </View>
    )};
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensor: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    top: -60,
  },
  BarraUm: {
    position: 'absolute',
    width: 10,
    height: 40,
    left: -10,
    backgroundColor: '#5adbff'
  },
  BarraDois: {
    position: 'absolute',
    width: 10,
    height: 40,
    left: 260,
    backgroundColor: '#5adbff'
  },
  info: {
    color: '#474954',
    fontSize: 35,
  },
  unidadeMedida: {
    fontSize: 15
  },
  Botoes: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 25
  },
  botao: {
    backgroundColor: '#FFFFFF',
    borderColor: '#474954',
    borderWidth: 5,
    width: 200,
    height: 200,
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 100,
  },
  botaoMenor: {
    backgroundColor: '#FFFFFF',
    borderColor: '#474954',
    borderWidth: 3,
    width: 100,
    height: 100,
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 100,
    marginTop: 10,
    marginRight: 140,
  },
  botaoMenor2: {
    backgroundColor: '#FFFFFF',
    borderColor: '#474954',
    borderWidth: 3,
    width: 100,
    height: 100,
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 100,
    marginTop: -100,
    marginRight: -130,
  },
  imgLogo:{
    height: 140,
    width: 140,
    marginTop: 40,
    top: -90,
  },
  imgPedestre:{
    height: 80,
    width: 80,
    marginLeft: 10,
  },
  imgMoto:{
    height: 80,
    width: 80,
    marginLeft: 8,
    marginTop: 4,
  },
  imgPlay:{
    height: 200,
    width: 200,
  },
  estadoPortao: {
    fontSize: 40,
    fontFamily: 'Courier New, Courier, monospace',
    color: '#474954',
    marginLeft: -20
  },
  aberturaValor: {
    fontSize: 27,
    fontFamily: 'Courier New, Courier, monospace',
    color: '#fff',
    marginTop: -31,
    marginLeft: 135
  }
});