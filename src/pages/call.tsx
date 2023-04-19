import {useState} from 'react';
import {Text, TextInput, View, StyleSheet, Pressable} from 'react-native';
import axios from 'axios';

const AudioCall = () => {
  const [to, setTo] = useState('+923234459495');
  const [sid, setSid] = useState('');

  const handleCall = async () => {
    try {
      const res = await axios.get(
        'https://761a-139-135-38-177.ngrok-free.app/call',
        {
          params: {
            to: to,
          },
        },
      );
      setSid(res.data?.data || '');
    } catch (error: any) {
      console.warn(error?.message);
    }
  };
  const handleCancelCall = async () => {
    try {
      await axios.get('https://761a-139-135-38-177.ngrok-free.app/cancel', {
        params: {sid: sid},
      });
      setSid('');
    } catch (error: any) {
      console.warn(error?.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>From:</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="Room Name"
        defaultValue={'+16204009508'}
        inputMode="tel"
        editable={false}
        selectTextOnFocus={false}
      />
      <Text style={styles.label}>To:</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="Room Name"
        defaultValue={to}
        onChangeText={text => setTo(text)}
        inputMode="tel"
      />
      {!sid && (
        <Pressable style={styles.button} onPress={handleCall}>
          <Text style={styles.btnText}>Call</Text>
        </Pressable>
      )}
      {sid && (
        <Pressable style={styles.button} onPress={handleCancelCall}>
          <Text style={styles.btnText}>Cancel Call</Text>
        </Pressable>
      )}
    </View>
  );
};
export default AudioCall;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: '#e8e7e7',
    padding: 20,
  },
  label: {
    fontSize: 18,
  },
  inputBox: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
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
