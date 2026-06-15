import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import axios from 'axios';

export default function ListarAvisosScreen({ route }) {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pega os parâmetros passados pela navegação
  const isAdmin = route.params?.isAdmin || false;
  const nomeUsuarioLogado = route.params?.nomeUsuario || null;
  useEffect(() => {
    fetchAvisos();
  }, []);

  const fetchAvisos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/avisos');
      setAvisos(response.data);
    } catch (error) {
      console.error("Erro ao buscar avisos:", error);
    } finally {
      setLoading(false);
    }
  };

  const executarExclusao = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/avisos/${id}`);
      setAvisos(prevAvisos => prevAvisos.filter(aviso => aviso.id !== id));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o aviso. Verifique o terminal do backend.');
    }
  };

  const handleExcluir = (id) => {
    if (Platform.OS === 'web') {
      const confirmar = window.confirm("Tem certeza que deseja apagar este aviso?");
      if (confirmar) {
        executarExclusao(id);
      }
    } else {
      Alert.alert(
        "Excluir Aviso",
        "Tem certeza que deseja apagar este aviso?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Excluir", 
            style: "destructive", 
            onPress: () => executarExclusao(id) 
          }
        ]
      );
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
  };

  const renderAviso = ({ item }) => {
    // LÓGICA DE PERMISSÃO:
    // Pode excluir SE for Admin OU SE o nome do usuário logado for exatamente igual ao autor do aviso
    const isAutorDoAviso = nomeUsuarioLogado && item.autor === nomeUsuarioLogado;
    const podeExcluir = isAdmin || isAutorDoAviso;

    return (
      <View style={styles.card}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.mensagem}>{item.mensagem}</Text>
        
        <View style={styles.footer}>
          <View>
            <Text style={styles.autor}>Por: {item.autor}</Text>
            <Text style={styles.data}>{formatarData(item.data_publicacao)}</Text>
          </View>

          {/* Renderiza o botão de excluir apenas se 'podeExcluir' for verdadeiro */}
          {podeExcluir && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleExcluir(item.id)}>
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Mural de Avisos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : avisos.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum aviso publicado no momento.</Text>
      ) : (
        <FlatList
          data={avisos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAviso}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3, borderLeftWidth: 5, borderLeftColor: '#ff9800' },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  mensagem: { fontSize: 15, color: '#555', marginBottom: 15, lineHeight: 22 },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    paddingTop: 10 
  },
  autor: { fontSize: 12, color: '#888', fontStyle: 'italic' },
  data: { fontSize: 12, color: '#888' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#777', marginTop: 40 },
  deleteButton: {
    backgroundColor: '#fff0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffcccc'
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: 'bold'
  }
});