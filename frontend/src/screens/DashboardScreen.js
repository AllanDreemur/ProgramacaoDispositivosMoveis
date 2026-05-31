import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* 1. CABEÇALHO COM INDICAÇÃO DE CONTA ADMIN */}
      <View style={styles.header}>
        <Text style={styles.title}>Painel de Controle</Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>⭐ CONTA ADMIN</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Selecione uma opção:</Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CadastroAluno')}>
          <Text style={styles.cardText}>Cadastro de Alunos</Text> 
        </TouchableOpacity>

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

      {/* 2. BOTÃO DE SAIR / HOME */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  
  // Estilos do Cabeçalho Admin
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  adminBadge: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  adminBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },

  // Estilos do Menu Central
  cardsContainer: {
    flex: 1,
  },
  subtitle: { 
    fontSize: 18, 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#555' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    marginBottom: 15, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5 
  }, 
  cardText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    textAlign: 'center' 
  },

  // Estilos do Botão de Logout
  logoutButton: {
    marginTop: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc3545',
    backgroundColor: '#fff8f8',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  }
});