import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.2.78:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      //console.log(data);
      //onLogin(data.token, data.user.name);//Pass the entire user object
      console.log("LOGGED IN");
    } catch (error) {
      console.error('Login failed:', error);
      setSnackbarVisible(true);//Show error message
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Login</Text>
        <TextInput
          label="Username"
          value={username}
          onChangeText={text => setUsername(text)}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          style={styles.input}
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Log In
        </Button>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}//Adjust as needed
        >
          Login failed. Please try again.
        </Snackbar>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  form: {
    width: '80%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default Login;
