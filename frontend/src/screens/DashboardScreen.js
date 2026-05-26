import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Selecione uma opção:</Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CadastroAluno')}>
        <Text style={styles.cardText}>Cadastro de Alunos</Text> 
      </TouchableOpacity>

      {}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CadastroProfessor')}>
        <Text style={styles.cardText}>Cadastro de Professores</Text> 
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CadastroDisciplina')}>
        <Text style={styles.cardText}>Cadastro de Disciplinas</Text> 
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Boletim')}>
        <Text style={styles.cardText}>Consulta de Boletim</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  subtitle: { fontSize: 18, marginBottom: 20, textAlign: 'center', color: '#555' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 }, // Implementação de cards [cite: 98]
  cardText: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' }
});