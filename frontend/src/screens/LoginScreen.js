import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; // <-- Adicionar a importação

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => { // <-- Transformar em async
    if (email.trim() === '' || senha.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha o login/email e a senha.');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, senha });
      
      if (response.data.token) {
        navigation.replace('Dashboard');
      }
    } catch (error) {
      Alert.alert('Erro de Autenticação', 'Credenciais inválidas ou erro no servidor.');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Scholar</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Login ou Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#0056b3', padding: 15, borderRadius: 8, alignItems: 'center' }, // [cite: 84]
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});