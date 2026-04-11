import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function AlunoRegistrationScreen() {
  // Estados para os campos mínimos exigidos [cite: 101]
  const [nome, setNome] = useState(''); // [cite: 102]
  const [matricula, setMatricula] = useState(''); // [cite: 103]
  const [curso, setCurso] = useState(''); // [cite: 104]
  const [email, setEmail] = useState(''); // [cite: 105]
  const [telefone, setTelefone] = useState(''); // [cite: 106]
  const [cep, setCep] = useState(''); // [cite: 107]
  const [endereco, setEndereco] = useState(''); // [cite: 108]
  const [cidade, setCidade] = useState(''); // [cite: 111]
  const [estado, setEstado] = useState(''); // [cite: 112]

  const handleCadastro = () => {
    // Exibindo no console como solicitado na Fase 1 [cite: 113]
    console.log({ nome, matricula, curso, email, telefone, cep, endereco, cidade, estado });
    Alert.alert('Sucesso', 'Aluno cadastrado temporariamente!');
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