import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function DisciplinaRegistrationScreen() {
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  
  const [professorResponsavelId, setProfessorResponsavelId] = useState('');
  const [professorResponsavelNome, setProfessorResponsavelNome] = useState('');
  
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');

  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erros, setErros] = useState({});

  // ESTADOS DOS MENUS DROP DOWN
  const [professores, setProfessores] = useState([]);
  const [loadingProfessores, setLoadingProfessores] = useState(true);
  const [showProfessorDropdown, setShowProfessorDropdown] = useState(false);
  
  const [showCursoDropdown, setShowCursoDropdown] = useState(false);
  const opcoesCurso = [
    'Análise e Desenvolvimento de Sistemas',
    'Desenvolvimento de Software Multiplataforma',
    'Ciência da Computação',
    'Engenharia de Software'
  ];

  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/professores');
        setProfessores(response.data);
      } catch (error) {
        console.log("Erro ao buscar professores:", error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de professores.');
      } finally {
        setLoadingProfessores(false);
      }
    };
    fetchProfessores();
  }, []);

  const validarCampos = () => {
    let novosErros = {};

    if (!nomeDisciplina.trim()) novosErros.nomeDisciplina = 'O nome da disciplina é obrigatório.';
    else if (nomeDisciplina.trim().length < 3) novosErros.nomeDisciplina = 'O nome deve ter pelo menos 3 caracteres.';

    if (!cargaHoraria.trim()) novosErros.cargaHoraria = 'A carga horária é obrigatória.';
    else if (Number(cargaHoraria) <= 0) novosErros.cargaHoraria = 'Digite uma carga horária válida.';

    if (!professorResponsavelId) novosErros.professorResponsavel = 'Selecione um professor responsável.';
    if (!curso) novosErros.curso = 'O curso é obrigatório.';
    if (!semestre.trim()) novosErros.semestre = 'O semestre é obrigatório.';
    else if (Number(semestre) <= 0) novosErros.semestre = 'Digite um semestre válido.';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastro = async () => {
    setMensagemSucesso('');
    setShowProfessorDropdown(false);
    setShowCursoDropdown(false);

    if (!validarCampos()) return; 

    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/disciplinas', { 
        nomeDisciplina, 
        cargaHoraria, 
        professorResponsavel: professorResponsavelId, 
        curso, 
        semestre 
      });
      
      setNomeDisciplina('');
      setCargaHoraria('');
      setProfessorResponsavelId('');
      setProfessorResponsavelNome('');
      setCurso('');
      setSemestre('');
      setErros({});

      setMensagemSucesso('Disciplina cadastrada com sucesso!');
      setTimeout(() => setMensagemSucesso(''), 3000);

    } catch (error) {
      if (error.response?.data?.errosMultiplos) {
        setErros(prev => ({ ...prev, ...error.response.data.errosMultiplos }));
      } else {
        const mensagemErro = error.response?.data?.error || 'Não foi possível salvar a disciplina.';
        Alert.alert('Erro no Servidor', mensagemErro);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Dados da Disciplina</Text>
      
      <TextInput 
        style={[styles.input, erros.nomeDisciplina && styles.inputError]} 
        placeholder="Nome da disciplina" 
        value={nomeDisciplina} 
        onChangeText={(texto) => { setNomeDisciplina(texto); setErros({...erros, nomeDisciplina: null}); }} 
        editable={!loading} 
      />
      {erros.nomeDisciplina && <Text style={styles.errorText}>{erros.nomeDisciplina}</Text>}

      {/* CAMPO CARGA HORÁRIA */}
      <TextInput 
        style={[styles.input, erros.cargaHoraria && styles.inputError]} 
        placeholder="Carga horária (horas)" 
        value={cargaHoraria} 
        onChangeText={(texto) => { 
          const apenasNumeros = texto.replace(/[^0-9]/g, ''); // Remove qualquer coisa que não seja número
          setCargaHoraria(apenasNumeros); 
          setErros({...erros, cargaHoraria: null}); 
        }} 
        keyboardType="numeric" 
        editable={!loading} 
      />
      {erros.cargaHoraria && <Text style={styles.errorText}>{erros.cargaHoraria}</Text>}

      {/* CAMPO PROFESSOR RESPONSÁVEL (Dropdown) */}
      <TouchableOpacity 
        style={[styles.input, erros.professorResponsavel && styles.inputError, { justifyContent: 'center' }]} 
        activeOpacity={0.7}
        onPress={() => {
          if (!loading && !loadingProfessores && professores.length > 0) {
            setShowProfessorDropdown(!showProfessorDropdown);
            setShowCursoDropdown(false); // Fecha o menu de cursos se estiver aberto
          } else if (professores.length === 0 && !loadingProfessores) {
            Alert.alert('Aviso', 'Nenhum professor cadastrado ainda.');
          }
        }}
      >
        {loadingProfessores ? (
          <Text style={{ color: '#999' }}>A carregar professores...</Text>
        ) : (
          <Text style={{ color: professorResponsavelNome ? '#333' : '#999' }}>
            {professorResponsavelNome || 'Selecione o Professor Responsável'}
          </Text>
        )}
      </TouchableOpacity>
      {erros.professorResponsavel && <Text style={styles.errorText}>{erros.professorResponsavel}</Text>}

      {showProfessorDropdown && (
        <View style={styles.dropdown}>
          {professores.map((prof) => (
            <TouchableOpacity 
              key={prof.id} 
              style={styles.dropdownItem} 
              onPress={() => {
                setProfessorResponsavelId(prof.id);
                setProfessorResponsavelNome(prof.nome);
                setErros({ ...erros, professorResponsavel: null });
                setShowProfessorDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{prof.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/*CAMPO CURSO (Dropdown)*/}
      <TouchableOpacity 
        style={[styles.input, erros.curso && styles.inputError, { justifyContent: 'center' }]} 
        activeOpacity={0.7}
        onPress={() => {
          if (!loading) {
            setShowCursoDropdown(!showCursoDropdown);
            setShowProfessorDropdown(false); // Fecha o menu de professores se estiver aberto
          }
        }}
      >
        <Text style={{ color: curso ? '#333' : '#999' }}>
          {curso || 'Selecione o Curso'}
        </Text>
      </TouchableOpacity>
      {erros.curso && <Text style={styles.errorText}>{erros.curso}</Text>}

      {showCursoDropdown && (
        <View style={styles.dropdown}>
          {opcoesCurso.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.dropdownItem} 
              onPress={() => {
                setCurso(item);
                setErros({ ...erros, curso: null });
                setShowCursoDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* CAMPO SEMESTRE */}
      <TextInput 
        style={[styles.input, erros.semestre && styles.inputError]} 
        placeholder="Semestre (Ex: 1, 2, 3)" 
        value={semestre} 
        onChangeText={(texto) => { 
          const apenasNumeros = texto.replace(/[^0-9]/g, ''); // Remove qualquer coisa que não seja número
          setSemestre(apenasNumeros); 
          setErros({...erros, semestre: null}); 
        }} 
        keyboardType="numeric" 
        editable={!loading} 
      />
      {erros.semestre && <Text style={styles.errorText}>{erros.semestre}</Text>}

      {mensagemSucesso !== '' && (
        <View style={styles.sucessoContainer}>
          <Text style={styles.sucessoText}>{mensagemSucesso}</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleCadastro} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'SALVANDO...' : 'SALVAR DADOS'}</Text>
      </TouchableOpacity>

      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  inputError: { borderColor: '#dc3545', backgroundColor: '#fff8f8' },
  errorText: { color: '#dc3545', fontSize: 13, marginTop: -8, marginBottom: 10, marginLeft: 4, fontWeight: '500' },
  
  // Estilos do Dropdown
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: -8, 
    marginBottom: 12,
    maxHeight: 200, 
    overflow: 'hidden',
    elevation: 2,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },

  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#94d3a2' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sucessoContainer: { backgroundColor: '#d4edda', borderColor: '#c3e6cb', borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  sucessoText: { color: '#155724', fontWeight: 'bold', fontSize: 15 }
});