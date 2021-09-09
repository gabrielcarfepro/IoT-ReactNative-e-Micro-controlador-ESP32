#include <WiFi.h>
#include <IOXhop_FirebaseESP32.h>
#include <ArduinoJson.h>

TaskHandle_t dadosSensor;
TaskHandle_t tarefa2;
TaskHandle_t tarefa3;

//#define WIFI_SSID "Nome da Rede WIFI"
//#define WIFI_PASSWORD "Senha da Rede WIFI" 
//#define FIREBASE_HOST "link do HOST do Firebase"    
//#define FIREBASE_AUTH "Autenticação do Firebase"   


// DEFINIÇÃO DOS PINOS DO MICRO-CONTROLADOR E DE ALGUMAS VARIÁVEIS

int trigPin = 26; // Sensor de Distância
int echoPin = 27; // Sensor de Distância
#define acionar 13
float tempoSinal; // Sensor de Distância
float distancia;  // Sensor de Distância
int abertura; // Sensor de Distâcia
String EstadoPortao;
String abertoOuFechado;
//static uint8_t taskCoreZero = 0;
//static uint8_t taskCoreOne = 1;

/////////////////////////////////////////////////////////////////

// DEFINIÇÃO DO SETUP AO INICIAR O MICRO-CONTROLADOR

void setup() {
  
  Serial.begin(115200);
  pinMode(acionar, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando ao WIFI");
  
  while (WiFi.status() != WL_CONNECTED)
  {
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.print(".");
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
  }
  
    Serial.println();
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    digitalWrite(LED_BUILTIN, HIGH);

  Firebase.setString("/controle/estado", "off");  
  Firebase.setString("/pedestre/estado", "off"); 
  Firebase.setString("/motocicletas/estado", "off");
  Firebase.setString("/LongPress/estado", "off");
  Firebase.setInt("/Abertura/valor", 0);
    
   

  xTaskCreatePinnedToCore(EnviarSensor, "EnviarSensor", 10000, NULL, 3,  & dadosSensor, 1);
  delay(500);
  xTaskCreatePinnedToCore(Click, "Click", 10000, NULL, 3, & tarefa2, 0);
  delay(500);
  //xTaskCreatePinnedToCore(PedeEmoto, "PedeEmoto", 10000, NULL, 2, & tarefa3, 1);
  //delay(500);
}

///////////////////////////////////////////////////////////////////////////////////
//FUNÇÃO DE RESET CASO O WIFI CAIA

//void (*funcReset) () = 0;

/////////////////////////////////////////////////////////////////

// FUNÇÃO QUE ENVIA OS DADOS DO SENSOR PARA O BANCO DE DADOS


void EnviarSensor(void *pvParameters) {
   
   while(true) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  unsigned long tempoSinal = pulseIn(echoPin, HIGH);
  distancia = tempoSinal/58;
  

   if (distancia < 400.01 && distancia >= 0) { // SETANDO LIMITE PARA O SENSOR
    distancia = distancia;
    } else if ( distancia <= 0) {
    distancia = 0;
  } else if (distancia >= 400) {
    distancia = 400;
  }

  abertura = 400 - distancia;

  //Firebase.setInt("/SensorDistancia/Distancia_cm", distancia);

  Serial.print(distancia);

  if (distancia < 395) { // FUNÇÃO CONDICIONAL PARA VERIFICAR SE O PORTÃO ESTÁ ABERTO OU FECHADO
    abertoOuFechado = "Aberto";
    Firebase.setString("/Portao/estado", "Aberto");
  } else if (distancia > 395) {
    abertoOuFechado = "Fechado";
    Firebase.setString("/Portao/estado", "Fechado");
  }

  if (abertura <= 0) {
    abertura = 0;
    //Firebase.setInt("/Abertura/valor", 0);
    //Firebase.setInt("/SensorDistancia/Distancia_cm", distancia);
  }
  
   Firebase.setInt("/Abertura/valor", abertura);

    delay(500);
  };
  
}

/////////////////////////////////////////////////////////////////

// FUNÇÃO DE CLICK ÚNICO DO CONTROLE PARA ACIONAR O PORTÃO E
// FUNÇÃO DE PedeEmoto PARA PEDESTRES E MOTOCICLETAS


void Click(void *pvParameters) {

  while(true){
    if (Firebase.getString("/controle/estado") == "on") {
    digitalWrite(acionar, HIGH);
    delay(350);
    digitalWrite(acionar, LOW);
    Firebase.setString("/controle/estado", "off");  
    }
  delay(500);
  }

}

/*void PedeEmoto(void *pvParameters){
  
  while(true){
  }
  delay(400);
}*/

void moto(){
    if (abertoOuFechado == "Fechado") {
            digitalWrite(acionar, HIGH);
            delay(350);
            digitalWrite(acionar, LOW);
            delay(7000);
            digitalWrite(acionar, HIGH);
            delay(350);
            digitalWrite(acionar, LOW);
            Firebase.setString("/motocicletas/estado", "off");
      } else if (abertoOuFechado == "Aberto") {
            digitalWrite(acionar, HIGH);
            delay(350);
            digitalWrite(acionar, LOW);
            Firebase.setString("/motocicletas/estado", "off");
      }
}

void pede(){
      if (abertoOuFechado == "Fechado") {
          digitalWrite(acionar, HIGH);
          delay(350);
          digitalWrite(acionar, LOW);
          delay(4000);
          digitalWrite(acionar, HIGH);
          delay(350);
          digitalWrite(acionar, LOW);
          Firebase.setString("/pedestre/estado", "off");
          
    } else if(abertoOuFechado == "Aberto") {
          digitalWrite(acionar, HIGH);
          delay(3500);
          digitalWrite(acionar, LOW);
          Firebase.setString("/pedestre/estado", "off"); 
    }
}

/////////////////////////////////////////////////////////////////

// FUNÇÃO LOOP PADRÃO DO MICRO-CONTROLADOR

  
void loop() {

    if (Firebase.getString("/pedestre/estado") == "on") {
      pede();
    }

    if (Firebase.getString("/motocicletas/estado") == "on"){
      moto();
    }

    if (WiFi.status() != WL_CONNECTED){
    setup();
  }
}

/////////////////////////////////////////////////////////////////

  /*EXEMPLOS DAS FUNÇÕES DO FIREBASE
  Serial.print(Firebase.getString("/controle"));
  Firebase.setString("/quarto/dono", "João");
  Firebase.setBool("/banheiro/ocupado", false);
  Firebase.setFloat("/quarto/temperatura", 24.7);
  Firebase.setInt("/sala/Temperatura", 23);
  Firebase.pushString("/quarto/registro", "nome");*/
