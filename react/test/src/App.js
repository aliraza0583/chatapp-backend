import {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import {Device} from 'twilio-client';
function App() {
  const [device, setToken] = useState(null);

  useEffect(() => {
    const setupDevice = async () => {
      const res = await axios.get(
        // 'https://761a-139-135-38-177.ngrok-free.app/api/token',
        'http://localhost:8000/api/token',
      );
      const resToken = res?.data?.token;
      console.log(resToken);

      const token = new Device(resToken, {
        logLevel: 1,
        // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
        // providing better audio quality in restrained network conditions.
        codecPreferences: ['opus', 'pcmu'],
      });
      setToken(token);
      token.on('ready', device => {
        console.log('ready use effect');
        // This is a listenner that fires when your device is ready
      });

      // token.on('connect', connection => {
      //   console.log('connected use effect');
      //   // This is a listener that fires when your device is connected to a phone call
      // });

      token.on('disconnect', connection => {
        console.log('disconnected useEffect');
        // This is a listener that fires when your device is disconnected from a phone call
      });
    };
    setupDevice();
  }, []);

  const makeCall = async () => {
    try {
      const params = {
        // get the phone number to call from the DOM
        To: '+923234459495',
      };
      if (device) {
        device.on('ready', async a => {
          a._disconnectAll();
          const call = await device.connect(params);
          console.log('call', call);
        });
      } else {
        console.log('not registered');
      }
    } catch (error) {
      console.log('error while make call' + error);
    }
  };
  return (
    <div className="App">
      <button onClick={makeCall}>Make call</button>
    </div>
  );
}

export default App;
