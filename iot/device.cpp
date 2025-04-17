#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "OPPO F17";
const char* password = "12345678";

const String serverURL = "https://bugs-and-glitches-hackgenx.onrender.com/api/readings/68008138bf4ea50da75722d6"; 

void setup() {
  Serial.begin(115200);
  connectToWiFi();
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
}

String getTimestamp() {
  unsigned long timeSeconds = millis() / 1000;
  int hours = (timeSeconds / 3600) % 24;
  int minutes = (timeSeconds / 60) % 60;
  int seconds = timeSeconds % 60;

  char timestamp[30];
  sprintf(timestamp, "2025-04-17T%02d:%02d:%02d.000Z", hours, minutes, seconds);
  return String(timestamp);
}

String generateRandomData() {
  float temperature = random(1500, 3000) / 100.0; 
  float humidity = random(4000, 9500) / 100.0;   
  int airQuality = random(50, 500);              

  String payload = "{";
  payload += "\"temperature\": " + String(temperature, 2) + ",";
  payload += "\"humidity\": " + String(humidity, 2) + ",";
  payload += "\"airQuality\": " + String(airQuality) + ",";
  payload += "\"timestamp\": \"" + getTimestamp() + "\"";
  payload += "}";

  return payload;
}

void sendData(String payload) {
  HTTPClient http;

  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.println("Error on sending POST: " + String(httpResponseCode));
  }

  http.end();
}

void loop() {
  String data = generateRandomData();
  Serial.println("Sending data: " + data);
  sendData(data);
  delay(3000); 
}