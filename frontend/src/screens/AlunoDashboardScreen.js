import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function AlunoDashboardScreen({ route, navigation }) {
  const alunoId = route.params?.id;
  const nomeUsuario = route.params?.nome || 'Aluno';
  const cursoAluno = route.params?.curso || 'Curso não informado';

  const [boletim, setBoletim] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qtdAvisos, setQtdAvisos] = useState(0);

  // Hook para buscar a quantidade de avisos sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      axios.get('http://localhost:3000/api/avisos')
        .then(res => setQtdAvisos(res.data.length))
        .catch(err => console.log("Erro ao buscar avisos:", err));
    }, [])
  );

  useEffect(() => {
    const carregarDadosAcademicos = async () => {
      try {
        const [resDisc, resNotas] = await Promise.all([
          axios.get('http://localhost:3000/api/disciplinas'),
          axios.get('http://localhost:3000/api/notas')
        ]);

        // 1. Pega apenas as disciplinas referentes ao curso do aluno logado
        const disciplinasDoCurso = resDisc.data.filter(d => d.curso === cursoAluno);
        
        // 2. Pega apenas as notas atreladas ao ID deste aluno
        const notasDoAluno = resNotas.data.filter(n => String(n.aluno_id) === String(alunoId));

        // 3. Mescla as informações para montar o Boletim
        const boletimCompleto = disciplinasDoCurso.map(disciplina => {
          const nota = notasDoAluno.find(n => n.disciplina_id === disciplina.id);
          return {
            id: disciplina.id,
            nomeDisciplina: disciplina.nome,
            cargaHoraria: disciplina.carga_horaria,
            nota1: nota ? nota.nota1 : '--',
            nota2: nota ? nota.nota2 : '--',
            media: nota ? nota.media : '--',
            situacao: nota ? nota.situacao : 'Pendente'
          };
        });

        setBoletim(boletimCompleto);
      } catch (error) {
        console.log("Erro ao carregar dados do aluno:", error);
        Alert.alert('Erro', 'Não foi possível carregar o seu boletim.');
      } finally {
        setLoading(false);
      }
    };

    if (alunoId) {
      carregarDadosAcademicos();
    } else {
      setLoading(false);
      Alert.alert('Aviso', 'Erro de identificação do aluno. Por favor, faça login novamente.');
    }
  }, [alunoId, cursoAluno]);

  const renderDisciplina = ({ item }) => {
    // Definindo a cor da tag de situação
    let corBadge = '#6c757d';
    if (item.situacao === 'Aprovado') corBadge = '#28a745';
    if (item.situacao === 'Reprovado') corBadge = '#dc3545';
    return (
      <View style={styles.card}>
        <Text style={styles.disciplinaNome}>{item.nomeDisciplina}</Text>
        <Text style={styles.cargaHoraria}>Carga Horária: {item.cargaHoraria}h</Text>
        
        <View style={styles.notasBox}>
          <View style={styles.notaColuna}>
            <Text style={styles.notaLabel}>N1</Text>
            <Text style={styles.notaValor}>{item.nota1}</Text>
          </View>
          <View style={styles.notaColuna}>
            <Text style={styles.notaLabel}>N2</Text>
            <Text style={styles.notaValor}>{item.nota2}</Text>
          </View>
          <View style={[styles.notaColuna, { borderRightWidth: 0 }]}>
            <Text style={styles.notaLabel}>Média</Text>
            <Text style={styles.notaValor}>{item.media}</Text>
          </View>
        </View>

        <View style={styles.situacaoRow}>
          <Text style={styles.situacaoLabel}>Situação Final:</Text>
          <View style={[styles.badge, { backgroundColor: corBadge }]}>
            <Text style={styles.badgeText}>{item.situacao}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* CABEÇALHO DO ALUNO */}
      <View style={styles.header}>
        <Text style={styles.title}>Portal do Aluno</Text>
        <View style={styles.alunoBadge}>
          <Text style={styles.alunoBadgeText}>📚 CONTA ALUNO</Text>
        </View>
      </View>

      <Text style={styles.welcomeText}>Olá, {nomeUsuario}!</Text>
      <Text style={styles.cursoText}>Curso: {cursoAluno}</Text>

      <Text style={styles.sectionTitle}>Meu Boletim</Text>

      {/* LISTAGEM DO BOLETIM */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6f42c1" style={{ marginTop: 40 }} />
        ) : boletim.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma disciplina encontrada para o seu curso.</Text>
        ) : (
          <FlatList
            data={boletim}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderDisciplina}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      {/* BOTÃO MURAL DE AVISOS (COM NOTIFICAÇÃO) */}
      <TouchableOpacity 
        style={[styles.card, { borderColor: '#ff9800', borderWidth: 1, borderTopWidth: 1, marginTop: 10 }]} 
        onPress={() => navigation.navigate('ListarAvisos')}
      >
        <Text style={styles.cardAvisoText}>Mural de Avisos</Text>
        {qtdAvisos > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{qtdAvisos} Novo(s)</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* BOTÃO DE SAIR */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
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
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  alunoBadge: {
    backgroundColor: '#6f42c1',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  alunoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  welcomeText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333', 
    textAlign: 'center' 
  },
  cursoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  listContainer: {
    flex: 1,
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 15, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5,
    borderTopWidth: 4,
    borderTopColor: '#6f42c1'
  }, 
  disciplinaNome: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 5 
  },
  cargaHoraria: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
  },
  notasBox: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  notaColuna: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd'
  },
  notaLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4
  },
  notaValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111'
  },
  situacaoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  situacaoLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444'
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13
  },
  emptyText: { 
    textAlign: 'center', 
    fontSize: 16, 
    color: '#777', 
    marginTop: 40 
  },
  
  cardAvisoText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    textAlign: 'center' 
  },
  notificationBadge: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: -10,
    right: -10,
    elevation: 4
  },
  notificationText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },

  logoutButton: {
    marginTop: 15,
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