import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function DisciplinaRegistrationScreen() {
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [professorResponsavel, setProfessorResponsavel] = useState('');
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');

  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erros, setErros] = useState({});

  const validarCampos = () => {
    let novosErros = {};

    if (!nomeDisciplina.trim()) novosErros.nomeDisciplina = 'O nome da disciplina é obrigatório.';
    else if (nomeDisciplina.trim().length < 3) novosErros.nomeDisciplina = 'O nome deve ter pelo menos 3 caracteres.';

    if (!cargaHoraria.trim()) novosErros.cargaHoraria = 'A carga horária é obrigatória.';
    else if (isNaN(cargaHoraria) || Number(cargaHoraria) <= 0) novosErros.cargaHoraria = 'Digite apenas números válidos (ex: 80).';

    if (!professorResponsavel.trim()) novosErros.professorResponsavel = 'O professor responsável é obrigatório.';
    
    if (!curso.trim()) novosErros.curso = 'O curso é obrigatório.';
    
    if (!semestre.trim()) novosErros.semestre = 'O semestre é obrigatório.';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastro = async () => {
    setMensagemSucesso('');

    if (!validarCampos()) {
      return; 
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/disciplinas', { 
        nomeDisciplina, cargaHoraria, professorResponsavel, curso, semestre 
      });
      
      setNomeDisciplina('');
      setCargaHoraria('');
      setProfessorResponsavel('');
      setCurso('');
      setSemestre('');
      setErros({});

      setMensagemSucesso('Disciplina cadastrada com sucesso!');
      
      setTimeout(() => {
        setMensagemSucesso('');
      }, 3000);

    } catch (error) {
      // Recebe os múltiplos erros do backend (incluindo se a disciplina já existir no curso)
      if (error.response?.data?.errosMultiplos) {
        const errosDoBackend = error.response.data.errosMultiplos;
        setErros(prev => ({ ...prev, ...errosDoBackend }));
      } else {
        const mensagemErro = error.response?.data?.error || 'Não foi possível salvar a disciplina.';
        Alert.alert('Erro no Servidor', mensagemErro);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dados da Disciplina</Text>
      
      <TextInput 
        style={[styles.input, erros.nomeDisciplina && styles.inputError]} 
        placeholder="Nome da disciplina" 
        value={nomeDisciplina} 
        onChangeText={(texto) => { setNomeDisciplina(texto); setErros({...erros, nomeDisciplina: null}); }} 
        editable={!loading} 
      />
      {erros.nomeDisciplina && <Text style={styles.errorText}>{erros.nomeDisciplina}</Text>}

      <TextInput 
        style={[styles.input, erros.cargaHoraria && styles.inputError]} 
        placeholder="Carga horária (horas)" 
        value={cargaHoraria} 
        onChangeText={(texto) => { setCargaHoraria(texto); setErros({...erros, cargaHoraria: null}); }} 
        keyboardType="numeric" 
        editable={!loading} 
      />
      {erros.cargaHoraria && <Text style={styles.errorText}>{erros.cargaHoraria}</Text>}

      <TextInput 
        style={[styles.input, erros.professorResponsavel && styles.inputError]} 
        placeholder="Professor responsável (ID ou Nome)" 
        value={professorResponsavel} 
        onChangeText={(texto) => { setProfessorResponsavel(texto); setErros({...erros, professorResponsavel: null}); }} 
        editable={!loading} 
      />
      {erros.professorResponsavel && <Text style={styles.errorText}>{erros.professorResponsavel}</Text>}

      <TextInput 
        style={[styles.input, erros.curso && styles.inputError]} 
        placeholder="Curso" 
        value={curso} 
        onChangeText={(texto) => { setCurso(texto); setErros({...erros, curso: null}); }} 
        editable={!loading} 
      />
      {erros.curso && <Text style={styles.errorText}>{erros.curso}</Text>}

      <TextInput 
        style={[styles.input, erros.semestre && styles.inputError]} 
        placeholder="Semestre (Ex: 1º Semestre)" 
        value={semestre} 
        onChangeText={(texto) => { setSemestre(texto); setErros({...erros, semestre: null}); }} 
        editable={!loading} 
      />
      {erros.semestre && <Text style={styles.errorText}>{erros.semestre}</Text>}

      {mensagemSucesso !== '' && (
        <View style={styles.sucessoContainer}>
          <Text style={styles.sucessoText}>{mensagemSucesso}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleCadastro}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'SALVANDO...' : 'SALVAR DADOS'}
        </Text>
      </TouchableOpacity>

      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { 
    backgroundColor: '#f9f9f9', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  inputError: {
    borderColor: '#dc3545',
    backgroundColor: '#fff8f8'
  },
  errorText: {
    color: '#dc3545',
    fontSize: 13,
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 4,
    fontWeight: '500'
  },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#94d3a2' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sucessoContainer: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center'
  },
  sucessoText: { color: '#155724', fontWeight: 'bold', fontSize: 15 }
});