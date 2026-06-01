import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';

export default function ProfessorDashboardScreen({ route, navigation }) {
  const nomeUsuario = route.params?.nome || 'Professor';

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 1. CABEÇALHO COM INDICAÇÃO DE CONTA DOCENTE */}
      <View style={styles.header}>
        <Text style={styles.title}>Painel Docente</Text>
        <View style={styles.professorBadge}>
          <Text style={styles.professorBadgeText}>🎓 CONTA DOCENTE</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Bem-vindo(a), {nomeUsuario}!</Text>

      {/* 2. MENU CENTRAL DE OPÇÕES*/}
      <View style={styles.cardsContainer}>
        
        {/* Opção 1: Minhas Disciplinas */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('MinhasDisciplinas', { 
            professorId: route.params?.id,
            area: route.params?.area 
          })}
        >
          <Text style={styles.cardText}>Minhas Disciplinas</Text> 
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('LancarNotas', { 
            id: route.params?.id 
          })}
        >
          <Text style={styles.cardText}>Lançamento de Notas</Text> 
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('ConsultarBoletins', { 
            id: route.params?.id 
          })}
        >
          <Text style={styles.cardText}>Consultar Boletins</Text> 
        </TouchableOpacity>
        
      </View>

      {/* 3. BOTÃO DE SAIR */}
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
  
  // Estilos do Cabeçalho Docente
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
  professorBadge: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  professorBadgeText: {
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