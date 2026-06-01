import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => { 
    if (email.trim() === '' || senha.trim() === '') {
      Alert.alert('Aviso', 'Por favor, preencha o email e a senha.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, senha });
      
      if (response.data.token) {
        const perfil = response.data.usuario.perfil;
        
        // Lógica de Redirecionamento Baseada no Perfil
        if (perfil === 'admin') {
          navigation.replace('Dashboard');
        } else if (perfil === 'professor') {
          // Passando o nome do usuário para a tela do professor
          navigation.replace('ProfessorDashboard', { 
            id: response.data.usuario.id, 
            nome: response.data.usuario.nome,
            area: response.data.usuario.area
          });
        } else if (perfil === 'aluno') {
          navigation.replace('AlunoDashboard', { nome: response.data.usuario.nome });
        } else {
          Alert.alert('Aviso', `Painel de ${perfil} ainda em desenvolvimento.`);
        }
      }
    } catch (error) {
      const mensagemErro = error.response?.data?.error || 'Credenciais inválidas ou erro no servidor.';
      Alert.alert('Erro de Autenticação', mensagemErro);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Scholar</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none" //
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'ENTRANDO...' : 'ENTRAR'}</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#0056b3', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#6c9ed3' }, // Cor mais clara quando está a carregar
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});