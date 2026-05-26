import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function BoletimScreen() {
  const [boletim, setBoletim] = useState([]);

  useEffect(() => {
    const buscarBoletim = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/boletim/12345'); 
        setBoletim(response.data.disciplinas); 
      } catch (error) {
        console.log("Erro ao carregar o boletim: ", error);
        Alert.alert('Erro', 'Não foi possível carregar o boletim do servidor.');
      }
    };

    buscarBoletim();
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
  );

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