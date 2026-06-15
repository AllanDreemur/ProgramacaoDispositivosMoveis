import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import axios from 'axios';

export default function ConsultarBoletinsScreen({ route }) {
  const professorId = route.params?.id;

  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dropdown de disciplinas
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Controle do Modal de Edição
  const [modalVisible, setModalVisible] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);
  const [editNota1, setEditNota1] = useState('');
  const [editNota2, setEditNota2] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [resDisc, resAlunos, resNotas] = await Promise.all([
        axios.get('http://localhost:3000/api/disciplinas'),
        axios.get('http://localhost:3000/api/alunos'),
        axios.get('http://localhost:3000/api/notas')
      ]);

      const minhasDisciplinas = resDisc.data.filter(d => String(d.professor_id) === String(professorId));
      setDisciplinas(minhasDisciplinas);
      setAlunos(resAlunos.data);
      setNotas(resNotas.data);
    } catch (error) {
      console.log("Erro:", error);
      Alert.alert('Erro', 'Não foi possível carregar os boletins.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (professorId) carregarDados();
  }, [professorId]);

  // Abre a janelinha com as notas atuais do aluno
  const abrirModalEdicao = (item) => {
    setNotaEditando(item);
    setEditNota1(String(item.nota1));
    setEditNota2(String(item.nota2));
    setModalVisible(true);
  };

  // Calcula a nova média e envia a atualização
  const salvarEdicao = async () => {
    if (!editNota1 || !editNota2) {
      Alert.alert('Erro', 'Preencha as duas notas.');
      return;
    }

    const v1 = parseFloat(editNota1);
    const v2 = parseFloat(editNota2);

    if (isNaN(v1) || v1 < 0 || v1 > 10 || isNaN(v2) || v2 < 0 || v2 > 10) {
      Alert.alert('Erro', 'As notas devem ser entre 0 e 10.');
      return;
    }

    // O Sistema recalcula automaticamente
    const mediaCalc = (v1 + v2) / 2;
    const situacaoCalc = mediaCalc >= 6.0 ? 'Aprovado' : 'Reprovado';

    setSalvando(true);
    try {
      await axios.post('http://localhost:3000/api/notas', {
        aluno_id: notaEditando.aluno_id,
        disciplina_id: notaEditando.disciplina_id,
        nota1: v1,
        nota2: v2,
        media: mediaCalc,
        situacao: situacaoCalc
      });

      setModalVisible(false);
      Alert.alert('Sucesso', `Nota atualizada! Nova média: ${mediaCalc.toFixed(1)}`);
      carregarDados();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a nota.');
    } finally {
      setSalvando(false);
    }
  };

  // Filtra as notas para exibir apenas as da disciplina que o professor selecionou no Dropdown
  const notasExibidas = notas.filter(n => n.disciplina_id === disciplinaSelecionada?.id);

  const renderNota = ({ item }) => {
    const aluno = alunos.find(a => a.id === item.aluno_id) || { nome: 'Aluno Desconhecido', matricula: '---' };

    return (
      <View style={styles.card}>
        <Text style={styles.alunoNome}>{aluno.nome}</Text>
        <Text style={styles.alunoMatricula}>RA: {aluno.matricula}</Text>
        
        <View style={styles.notasRow}>
          <Text style={styles.notaItem}>N1: <Text style={styles.notaBold}>{item.nota1}</Text></Text>
          <Text style={styles.notaItem}>N2: <Text style={styles.notaBold}>{item.nota2}</Text></Text>
          <Text style={styles.notaItem}>Média: <Text style={styles.notaBold}>{item.media}</Text></Text>
        </View>

        <View style={styles.situacaoRow}>
          <View style={[styles.badge, { backgroundColor: item.situacao === 'Aprovado' ? '#28a745' : '#dc3545' }]}>
            <Text style={styles.badgeText}>{item.situacao}</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={() => abrirModalEdicao(item)}>
            <Text style={styles.editButtonText}>✏️ Editar Nota</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Consultar Boletins</Text>

      {/* DROPDOWN DISCIPLINA */}
      <TouchableOpacity 
        style={styles.dropdownToggle} 
        activeOpacity={0.8}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={{ color: disciplinaSelecionada ? '#333' : '#999', fontWeight: 'bold' }}>
          {disciplinaSelecionada ? disciplinaSelecionada.nome : 'Selecione a Disciplina para ver as notas'}
        </Text>
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownContainer}>
          {disciplinas.length === 0 && <Text style={{padding: 10}}>Nenhuma disciplina cadastrada.</Text>}
          {disciplinas.map((d) => (
            <TouchableOpacity 
              key={d.id} 
              style={styles.dropdownItem} 
              onPress={() => {
                setDisciplinaSelecionada(d);
                setShowDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{d.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* LISTA DE NOTAS */}
      {loading ? (
        <ActivityIndicator size="large" color="#0056b3" style={{ marginTop: 40 }} />
      ) : !disciplinaSelecionada ? (
        <Text style={styles.emptyText}>Escolha uma disciplina acima.</Text>
      ) : notasExibidas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma nota lançada para esta disciplina.</Text>
      ) : (
        <FlatList
          data={notasExibidas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNota}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* MODAL DE EDIÇÃO FLUTUANTE */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Notas</Text>
            <Text style={styles.modalSubtitle}>Digite a nova pontuação do aluno.</Text>

            <TextInput 
              style={styles.modalInput} 
              value={editNota1} 
              onChangeText={(t) => setEditNota1(t.replace(/[^0-9.]/g, ''))} 
              keyboardType="numeric" 
              placeholder="Nota 1"
            />
            <TextInput 
              style={styles.modalInput} 
              value={editNota2} 
              onChangeText={(t) => setEditNota2(t.replace(/[^0-9.]/g, ''))} 
              keyboardType="numeric" 
              placeholder="Nota 2"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.btnCancel]} onPress={() => setModalVisible(false)} disabled={salvando}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.modalBtn, styles.btnSave]} onPress={salvarEdicao} disabled={salvando}>
                <Text style={styles.btnSaveText}>{salvando ? 'Salvando...' : 'Salvar Alteração'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  
  dropdownToggle: { backgroundColor: '#fff', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 5 },
  dropdownContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15, elevation: 2 },
  dropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 16, color: '#333' },
  
  emptyText: { textAlign: 'center', marginTop: 30, color: '#777', fontSize: 16 },

  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  alunoNome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  alunoMatricula: { fontSize: 14, color: '#777', marginBottom: 15 },
  notasRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 },
  notaItem: { fontSize: 15, color: '#555' },
  notaBold: { fontWeight: 'bold', color: '#000' },
  
  situacaoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  
  editButton: { backgroundColor: '#ffc107', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  editButtonText: { color: '#000', fontWeight: 'bold', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 25, borderRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  modalInput: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalBtn: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  btnCancel: { backgroundColor: '#f1f1f1' },
  btnCancelText: { color: '#333', fontWeight: 'bold' },
  btnSave: { backgroundColor: '#0056b3' },
  btnSaveText: { color: '#fff', fontWeight: 'bold' }
});