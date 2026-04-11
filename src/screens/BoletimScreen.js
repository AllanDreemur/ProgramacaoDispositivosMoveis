import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function BoletimScreen() {
  const [boletim, setBoletim] = useState([]);

  // Uso do useEffect para carregar dados simulados ao iniciar a tela [cite: 65, 69, 70]
  useEffect(() => {
    const dadosMockados = [
      { id: '1', disciplina: 'Design de Logos para E-sports', nota1: 9.0, nota2: 9.5, media: 9.25, situacao: 'Aprovado' },
      { id: '2', disciplina: 'Estratégias de Equipes Competitivas', nota1: 8.0, nota2: 8.0, media: 8.0, situacao: 'Aprovado' },
      { id: '3', disciplina: 'Programação Mobile I', nota1: 5.0, nota2: 6.0, media: 5.5, situacao: 'Exame' },
    ];
    setBoletim(dadosMockados);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.disciplina}>{item.disciplina}</Text> 
      <View style={styles.notasContainer}>
        <Text>N1: {item.nota1}</Text> 
        <Text>N2: {item.nota2}</Text> 
        <Text style={styles.media}>Média: {item.media}</Text> 
      </View>
      <Text style={[styles.situacao, { color: item.situacao === 'Aprovado' ? 'green' : 'orange' }]}>
        Situação: {item.situacao} 
      </Text>
    </View>
  ); // Os itens exibem disciplina, nota 1, nota 2, média e situação[cite: 129, 130, 131, 132, 133].

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Boletim</Text>
      <FlatList
        data={boletim}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  disciplina: { fontSize: 18, fontWeight: 'bold', color: '#0056b3', marginBottom: 10 },
  notasContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  media: { fontWeight: 'bold' },
  situacao: { fontSize: 16, fontWeight: 'bold', marginTop: 5 }
});