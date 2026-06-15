import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';

export default function CriarAvisoScreen({ navigation, route }) {
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  
  const autorLogado = route.params?.nome || 'Administração';

  const handlePublicar = async () => {
    if (!titulo || !mensagem) {
      Alert.alert('Erro', 'Por favor, preencha o título e a mensagem.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/avisos', {
        titulo,
        mensagem,
        autor: autorLogado
      });
      
      Alert.alert('Sucesso!', 'Aviso publicado no mural.');
      
      setTitulo('');
      setMensagem('');
      
    } catch (error) {
      Alert.alert('Erro', 'Falha ao publicar o aviso.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Novo Aviso</Text>
      
      <Text style={styles.label}>Título do Aviso</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: Feriado na Sexta-feira" 
        value={titulo} 
        onChangeText={setTitulo} 
      />

      <Text style={styles.label}>Mensagem</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Digite o conteúdo do aviso..." 
        value={mensagem} 
        onChangeText={setMensagem} 
        multiline={true} 
        numberOfLines={6} 
      />

      <TouchableOpacity style={styles.button} onPress={handlePublicar}>
        <Text style={styles.buttonText}>Publicar Aviso</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#555' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  textArea: { height: 120, textAlignVertical: 'top' },
  button: { backgroundColor: '#ff9800', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});