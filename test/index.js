function generateRandomData() {
    return {
      temperature: (Math.random() * 50).toFixed(2),
      humidity: (Math.random() * 100).toFixed(2),   
      airQuality: Math.floor(Math.random() * 500)   
    };
  }
  
  async function testAddReading(deviceId) {
    const data = generateRandomData();
    console.log('Sending reading data:', data);
  
    const payload = {
      temperature: parseFloat(data.temperature),
      humidity: parseFloat(data.humidity),
      airQuality: data.airQuality,
      timestamp: new Date().toISOString() 
    };
  
    try {
      const response = await fetch(` https://bugs-and-glitches-hackgenx.onrender.com/api/readings/${deviceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      const responseText = await response.text();
      console.log('Raw Response:', responseText);
  
      if (response.ok) {
        try {
          const result = JSON.parse(responseText);
          console.log('Response:', result);
        } catch (e) {
          console.error('Error parsing JSON response:', e);
        }
      } else {
        console.error(`API error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Network or API error:', err);
    }
  }
  
  const deviceId = '68008138bf4ea50da75722d6';
  setInterval(() => {
    testAddReading(deviceId);
  }, 3000);
  