import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function DisciplinaRegistrationScreen() {
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [professorResponsavel, setProfessorResponsavel] = useState('');
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');

  const handleCadastro = async () => {
    try {
      await axios.post('http://localhost:3000/api/disciplinas', { 
        nomeDisciplina, cargaHoraria, professorResponsavel, curso, semestre 
      });
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a disciplina.');
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dados da Disciplina</Text>
      
      <TextInput style={styles.input} placeholder="Nome da disciplina" value={nomeDisciplina} onChangeText={setNomeDisciplina} />
      <TextInput style={styles.input} placeholder="Carga horária (horas)" value={cargaHoraria} onChangeText={setCargaHoraria} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Professor responsável" value={professorResponsavel} onChangeText={setProfessorResponsavel} />
      <TextInput style={styles.input} placeholder="Curso" value={curso} onChangeText={setCurso} />
      <TextInput style={styles.input} placeholder="Semestre (Ex: 1º Semestre)" value={semestre} onChangeText={setSemestre} />

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