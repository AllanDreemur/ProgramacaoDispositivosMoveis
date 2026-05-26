import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function AlunoRegistrationScreen() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const buscarCep = async () => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.data.erro) {
          setEndereco(response.data.logradouro);
          setCidade(response.data.localidade);
          setEstado(response.data.uf);
        } else {
          Alert.alert('Aviso', 'CEP não encontrado.');
        }
      } catch (error) {
        Alert.alert('Erro', 'Falha ao conectar com o ViaCEP.');
      }
    }
  };

  const handleCadastro = async () => {
    try {
      await axios.post('http://localhost:3000/api/alunos', { 
        nome, matricula, curso, email, telefone, cep, endereco, cidade, estado 
      });
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao gravar os dados do aluno no servidor.');
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dados do Aluno</Text>
      
      <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Matrícula" value={matricula} onChangeText={setMatricula} />
      <TextInput style={styles.input} placeholder="Curso" value={curso} onChangeText={setCurso} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={setCep} keyboardType="number-pad" />
      <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
      <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
      <TextInput style={styles.input} placeholder="Estado" value={estado} onChangeText={setEstado} />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>SALVAR DADOS</Text>
      </TouchableOpacity>
      <View style={{height: 50}} /> {/* Espaçamento final */}
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