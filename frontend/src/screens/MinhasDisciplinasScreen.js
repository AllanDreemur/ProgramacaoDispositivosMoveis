import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

export default function MinhasDisciplinasScreen({ route }) {
  // Resgata os parâmetros passados pelo Dashboard
  const { professorId, area } = route.params || {};
  
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMinhasDisciplinas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/disciplinas');
        
        // Filtra para exibir APENAS as disciplinas vinculadas ao ID deste professor
        const disciplinasDoProfessor = response.data.filter(d => d.professor_id === professorId);
        setDisciplinas(disciplinasDoProfessor);
        
      } catch (error) {
        console.log("Erro ao buscar disciplinas:", error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de disciplinas.');
      } finally {
        setLoading(false);
      }
    };

    if (professorId) {
      fetchMinhasDisciplinas();
    } else {
      setLoading(false);
      Alert.alert('Aviso', 'Erro de identificação do professor.');
    }
  }, [professorId]);

  // Estrutura visual de cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.disciplinaNome}>{item.nome}</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>📚 Curso: <Text style={styles.infoBold}>{item.curso}</Text></Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>⏱ Carga: {item.carga_horaria}h</Text>
        <Text style={styles.infoText}>📅 Semestre: {item.semestre}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho destacando a Área de Atuação principal */}
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Disciplinas</Text>
        {area ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Área Principal: {area}</Text>
          </View>
        ) : null}
      </View>

      {/* Exibição da Lista ou Carregamento */}
      {loading ? (
        <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 50 }} />
      ) : disciplinas.length === 0 ? (
        <Text style={styles.emptyText}>Você ainda não possui disciplinas e cursos vinculados ao seu perfil.</Text>
      ) : (
        <FlatList
          data={disciplinas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 25, 
    marginTop: 10 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8 
  },
  badge: { 
    backgroundColor: '#17a2b8',
    paddingVertical: 6, 
    paddingHorizontal: 16, 
    borderRadius: 20,
    elevation: 2
  },
  badgeText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 18, 
    borderRadius: 10, 
    marginBottom: 15, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#28a745'
  },
  disciplinaNome: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 12 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  infoText: { 
    fontSize: 14, 
    color: '#666' 
  },
  infoBold: {
    fontWeight: 'bold',
    color: '#444'
  },
  emptyText: { 
    textAlign: 'center', 
    fontSize: 16, 
    color: '#777', 
    marginTop: 40,
    paddingHorizontal: 20
  }
});