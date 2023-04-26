import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {Voice} from '@twilio/voice-react-native-sdk';

const Phone = () => {
  const [token, setToken] = useState<any>(null);
  const callRef = useRef<any>(null);
  useEffect(() => {
    const fetchToken = async () => {
      const res = await axios.get(
        'https://761a-139-135-38-177.ngrok-free.app/api/token',
      );
      const resToken = res?.data?.token;

      setToken(resToken);
    };
    fetchToken();
  }, []);
  const handleCall = async () => {
    try {
      const params = {
        // get the phone number to call from the DOM
        To: '+923234459495',
      };
      const voice = new Voice();
      const outgoingCall = await voice.connect(token.toString(), {params});

      callRef.current = outgoingCall;

      //disconnect call
      //@ts-ignore
      outgoingCall.on('disconnected', (a: any) => {
        console.log('disconnected', a);
      });
    } catch (error: any) {
      console.warn(error?.message);
    }
  };
  const handleCancelCall = () => {
    callRef?.current?.disconnect();
  };
  return (
    <>
      <Pressable style={styles.button} onPress={handleCall}>
        <Text style={styles.btnText}>Call</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleCancelCall}>
        <Text style={styles.btnText}>disconnect</Text>
      </Pressable>
    </>
  );
};

export default Phone;

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
    marginBottom: 10,
  },
  btnText: {
    color: '#ffffff',
  },
});
