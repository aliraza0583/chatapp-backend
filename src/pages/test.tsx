import axios from 'axios';
import {useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text} from 'react-native';
import {Device} from 'twilio-client';

const Test = () => {
  const [device, setToken] = useState<any>(null);

  useEffect(() => {
    const setupDevice = async () => {
      const res = await axios.get(
        'https://761a-139-135-38-177.ngrok-free.app/api/token',
      );
      const resToken = res?.data?.token;

      const token = new Device(resToken, {
        logLevel: 1,
        // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
        // providing better audio quality in restrained network conditions.
        //@ts-ignore
        codecPreferences: ['opus', 'pcmu'],
      });
      Alert.alert('device created successfully');
      console.log('token: ' + token);
      setToken(token);
      token.on('ready', device => {
        console.log('ready use effect');
        // This is a listenner that fires when your device is ready
      });

      token.on('disconnect', connection => {
        console.log('disconnected useEffect');
        // This is a listener that fires when your device is disconnected from a phone call
      });
    };
    setupDevice();
  }, []);
  const handleCall = async () => {
    try {
      const params = {
        // get the phone number to call from the DOM
        To: '+923234459495',
      };
      if (device) {
        console.log('aaaaaaa');
        device.on('ready', async (ready: any) => {
          ready._disconnectAll();
          const call = await device.connect(params);
          console.log('call', call);
        });
      } else {
        console.log('not registered');
      }
    } catch (error: any) {
      console.warn(error?.message);
    }
  };
  return (
    <Pressable style={styles.button} onPress={handleCall}>
      <Text style={styles.btnText}>Call</Text>
    </Pressable>
  );
};
export default Test;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#000000',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
  },
  btnText: {
    color: '#ffffff',
  },
});
