#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "OPPO F17";
const char* password = "12345678";

const char* serverUrl = "http://localhost:4213/api/67ff833d8c0a921cb860fca2/";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    float pm25 = random(20, 100); 
    float ph = random(60, 80) / 10.0;

    String jsonPayload = "{\"deviceId\":\"sensor-01\",\"pm25\":" + String(pm25, 2) + ",\"ph\":" + String(ph, 2) + "}";

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error sending POST: " + String(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }

  delay(1000);
}
