import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function LancarNotasScreen({ route }) {
  // Recebe o ID do professor logado vindo do Dashboard
  const professorId = route.params?.id;

  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erros, setErros] = useState({});

  // Estados para seleção nos Dropdowns
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  
  const [showDisciplinaDropdown, setShowDisciplinaDropdown] = useState(false);
  const [showAlunoDropdown, setShowAlunoDropdown] = useState(false);

  // Listas vindas do banco de dados
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loadingDados, setLoadingDados] = useState(true);

  // Carrega alunos e as disciplinas do professor ao abrir a tela
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [resDisciplinas, resAlunos] = await Promise.all([
          axios.get('http://localhost:3000/api/disciplinas'),
          axios.get('http://localhost:3000/api/alunos')
        ]);
        
        // Filtra para exibir APENAS as disciplinas vinculadas a este professor (igual fizemos na tela anterior)
        const disciplinasDoProfessor = resDisciplinas.data.filter(d => 
          String(d.professor_id) === String(professorId)
        );
        
        setDisciplinas(disciplinasDoProfessor);
        setAlunos(resAlunos.data);
        
      } catch (error) {
        console.log("Erro ao buscar dados:", error);
        Alert.alert('Erro', 'Verifique se as rotas GET /api/disciplinas e GET /api/alunos existem no backend.');
      } finally {
        setLoadingDados(false);
      }
    };

    if (professorId) {
      fetchDados();
    } else {
      setLoadingDados(false);
      Alert.alert('Aviso', 'Erro de identificação do professor.');
    }
  }, [professorId]);

  const validarCampos = () => {
    let novosErros = {};
    if (!disciplinaSelecionada) novosErros.disciplina = 'Selecione uma disciplina.';
    if (!alunoSelecionado) novosErros.aluno = 'Selecione um aluno.';
    
    if (!nota1.trim() || isNaN(nota1) || Number(nota1) < 0 || Number(nota1) > 10) {
      novosErros.nota1 = 'Digite uma nota entre 0 e 10.';
    }
    if (!nota2.trim() || isNaN(nota2) || Number(nota2) < 0 || Number(nota2) > 10) {
      novosErros.nota2 = 'Digite uma nota entre 0 e 10.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvarNotas = async () => {
    setMensagemSucesso('');
    setShowDisciplinaDropdown(false);
    setShowAlunoDropdown(false);
    
    if (!validarCampos()) return;

    setLoading(true);

    // Cálculos matemáticos antes de enviar ao backend
    const valorNota1 = parseFloat(nota1);
    const valorNota2 = parseFloat(nota2);
    const mediaCalculada = (valorNota1 + valorNota2) / 2;
    // Considerando a média 6.0 como padrão para aprovação
    const situacaoCalculada = mediaCalculada >= 6.0 ? 'Aprovado' : 'Reprovado';

    try {
      await axios.post('http://localhost:3000/api/notas', {
        aluno_id: alunoSelecionado.id,
        disciplina_id: disciplinaSelecionada.id,
        nota1: valorNota1,
        nota2: valorNota2,
        media: mediaCalculada,
        situacao: situacaoCalculada
      });
      
      setNota1('');
      setNota2('');
      setAlunoSelecionado(null);
      setErros({}); 
      setMensagemSucesso(`Notas salvas! Média: ${mediaCalculada.toFixed(1)} (${situacaoCalculada})`);
      
      setTimeout(() => setMensagemSucesso(''), 4000);
    } catch (error) {
      Alert.alert('Erro no Servidor', error.response?.data?.error || 'Não foi possível salvar as notas. Verifique a rota POST /api/notas.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Lançamento de Notas</Text>

      {/* DROPDOWN DISCIPLINA */}
      <TouchableOpacity 
        style={[styles.input, erros.disciplina && styles.inputError, { justifyContent: 'center' }]} 
        activeOpacity={0.7}
        onPress={() => {
          if (!loading && !loadingDados && disciplinas.length > 0) {
            setShowDisciplinaDropdown(!showDisciplinaDropdown);
            setShowAlunoDropdown(false);
          } else if (disciplinas.length === 0 && !loadingDados) {
             Alert.alert('Aviso', 'Você não possui disciplinas cadastradas.');
          }
        }}
      >
        {loadingDados ? (
          <Text style={{ color: '#999' }}>A carregar disciplinas...</Text>
        ) : (
          <Text style={{ color: disciplinaSelecionada ? '#333' : '#999' }}>
            {disciplinaSelecionada ? disciplinaSelecionada.nome : 'Selecione a Disciplina'}
          </Text>
        )}
      </TouchableOpacity>
      {erros.disciplina && <Text style={styles.errorText}>{erros.disciplina}</Text>}

      {showDisciplinaDropdown && (
        <View style={styles.dropdown}>
          {disciplinas.map((d) => (
            <TouchableOpacity 
              key={d.id} 
              style={styles.dropdownItem} 
              onPress={() => {
                setDisciplinaSelecionada(d);
                setErros({ ...erros, disciplina: null });
                setShowDisciplinaDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{d.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* DROPDOWN ALUNO */}
      <TouchableOpacity 
        style={[styles.input, erros.aluno && styles.inputError, { justifyContent: 'center' }]} 
        activeOpacity={0.7}
        onPress={() => {
          if (!loading && !loadingDados && alunos.length > 0) {
            setShowAlunoDropdown(!showAlunoDropdown);
            setShowDisciplinaDropdown(false);
          } else if (alunos.length === 0 && !loadingDados) {
             Alert.alert('Aviso', 'Nenhum aluno encontrado no banco.');
          }
        }}
      >
        {loadingDados ? (
          <Text style={{ color: '#999' }}>A carregar alunos...</Text>
        ) : (
          <Text style={{ color: alunoSelecionado ? '#333' : '#999' }}>
            {alunoSelecionado ? `${alunoSelecionado.nome} (${alunoSelecionado.matricula})` : 'Selecione o Aluno'}
          </Text>
        )}
      </TouchableOpacity>
      {erros.aluno && <Text style={styles.errorText}>{erros.aluno}</Text>}

      {showAlunoDropdown && (
        <View style={styles.dropdown}>
          {alunos.map((a) => (
            <TouchableOpacity 
              key={a.id} 
              style={styles.dropdownItem} 
              onPress={() => {
                setAlunoSelecionado(a);
                setErros({ ...erros, aluno: null });
                setShowAlunoDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{a.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* CAMPOS DE NOTAS */}
      <View style={styles.notasContainer}>
        <View style={styles.notaWrapper}>
          <TextInput 
            style={[styles.input, erros.nota1 && styles.inputError]} 
            placeholder="Nota 1 (Ex: 8.5)" 
            value={nota1} 
            onChangeText={(t) => { setNota1(t.replace(/[^0-9.]/g, '')); setErros({...erros, nota1: null}); }} 
            keyboardType="numeric" 
            editable={!loading} 
          />
          {erros.nota1 && <Text style={styles.errorText}>{erros.nota1}</Text>}
        </View>

        <View style={styles.notaWrapper}>
          <TextInput 
            style={[styles.input, erros.nota2 && styles.inputError]} 
            placeholder="Nota 2 (Ex: 7.0)" 
            value={nota2} 
            onChangeText={(t) => { setNota2(t.replace(/[^0-9.]/g, '')); setErros({...erros, nota2: null}); }} 
            keyboardType="numeric" 
            editable={!loading} 
          />
          {erros.nota2 && <Text style={styles.errorText}>{erros.nota2}</Text>}
        </View>
      </View>

      {mensagemSucesso !== '' && (
        <View style={styles.sucessoContainer}>
          <Text style={styles.sucessoText}>{mensagemSucesso}</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSalvarNotas} disabled={loading} >
        {loading ? (
           <ActivityIndicator size="small" color="#fff" />
        ) : (
           <Text style={styles.buttonText}>SALVAR NOTAS</Text>
        )}
      </TouchableOpacity>
      
      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#eee', color: '#333' },
  inputError: { borderColor: '#dc3545', backgroundColor: '#fff8f8' },
  errorText: { color: '#dc3545', fontSize: 13, marginTop: -8, marginBottom: 10, marginLeft: 4, fontWeight: '500' },
  dropdown: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: -8, marginBottom: 12, maxHeight: 200, overflow: 'hidden', elevation: 2 },
  dropdownItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 15, color: '#333' },
  notasContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  notaWrapper: { width: '48%' },
  button: { backgroundColor: '#0056b3', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#6c9ed3' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sucessoContainer: { backgroundColor: '#d4edda', borderColor: '#c3e6cb', borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  sucessoText: { color: '#155724', fontWeight: 'bold', fontSize: 15 }
});