import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function ProfessorRegistrationScreen() {
  const [nome, setNome] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [tempoDocencia, setTempoDocencia] = useState('');
  const [email, setEmail] = useState('');

  const handleCadastro = async () => {
    try {
      await axios.post('http://localhost:3000/api/professores', { 
        nome, titulacao, areaAtuacao, tempoDocencia, email 
      });
      Alert.alert('Sucesso', 'Professor cadastrado com sucesso no Banco de Dados!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o professor.');
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dados do Professor</Text>
      
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Titulação (Ex: Mestre, Doutor)" value={titulacao} onChangeText={setTitulacao} />
      <TextInput style={styles.input} placeholder="Área de atuação" value={areaAtuacao} onChangeText={setAreaAtuacao} />
      <TextInput style={styles.input} placeholder="Tempo de docência" value={tempoDocencia} onChangeText={setTempoDocencia} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>SALVAR DADOS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});