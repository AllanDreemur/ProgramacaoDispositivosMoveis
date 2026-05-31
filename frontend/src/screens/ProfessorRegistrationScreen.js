import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function ProfessorRegistrationScreen() {
  const [nome, setNome] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [curso, setCurso] = useState(''); // Alterado de areaAtuacao para curso
  const [tempoDocencia, setTempoDocencia] = useState('');
  const [email, setEmail] = useState('');
  
  const [senhaGerada, setSenhaGerada] = useState('');
  
  const [loading, setLoading] = useState(false); 
  const [mensagemSucesso, setMensagemSucesso] = useState(''); 
  const [erros, setErros] = useState({});

  const [showTitulacao, setShowTitulacao] = useState(false);
  const [showCursoDropdown, setShowCursoDropdown] = useState(false);

  const opcoesTitulacao = ['Especialista', 'Mestre', 'Doutor', 'Pós-Doutor'];
  
  // ESTADOS PARA OS CURSOS VINDOS DO BANCO
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(true);

  const gerarSenhaAleatoria = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let senha = '';
    for (let i = 0; i < 6; i++) {
      senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return senha;
  };

  // Carrega os cursos e a senha ao iniciar a tela
  useEffect(() => {
    setSenhaGerada(gerarSenhaAleatoria());

    const fetchCursos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cursos');
        setCursos(response.data);
      } catch (error) {
        console.log("Erro ao buscar cursos:", error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de cursos.');
      } finally {
        setLoadingCursos(false);
      }
    };
    fetchCursos();
  }, []);

  const validarCampos = () => {
    let novosErros = {}; 

    if (!nome.trim()) novosErros.nome = 'O nome é obrigatório.';
    else if (nome.trim().length < 3) novosErros.nome = 'O nome deve ter pelo menos 3 caracteres.';

    if (!titulacao.trim()) novosErros.titulacao = 'A titulação é obrigatória.';
    
    if (!curso) novosErros.curso = 'O curso é obrigatório.';

    if (!tempoDocencia.trim()) novosErros.tempoDocencia = 'O tempo de docência é obrigatório.';
    else if (isNaN(tempoDocencia) || Number(tempoDocencia) < 0) novosErros.tempoDocencia = 'Digite apenas números válidos (ex: 5).';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) novosErros.email = 'O e-mail é obrigatório.';
    else if (!emailRegex.test(email)) novosErros.email = 'Digite um e-mail válido (ex: email@fatec.br).';

    setErros(novosErros); 
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastro = async () => {
    setMensagemSucesso('');
    setShowTitulacao(false);
    setShowCursoDropdown(false);
    
    if (!validarCampos()) {
      return; 
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/professores', { 
        nome, 
        titulacao, 
        areaAtuacao: curso, 
        tempoDocencia, 
        email, 
        senha: senhaGerada 
      });
      
      setNome('');
      setTitulacao('');
      setCurso('');
      setTempoDocencia('');
      setEmail('');
      setErros({}); 

      setSenhaGerada(gerarSenhaAleatoria());

      setMensagemSucesso('Professor cadastrado com sucesso!');
      
      setTimeout(() => {
        setMensagemSucesso('');
      }, 3000);

    } catch (error) {
      const mensagemErro = error.response?.data?.error || 'Não foi possível salvar o professor.';
      
      if (mensagemErro.includes('e-mail já está cadastrado')) {
        setErros(prev => ({ ...prev, email: mensagemErro }));
      } else {
        Alert.alert('Erro no Servidor', mensagemErro);
      }
      console.log(error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Dados do Professor</Text>
      
      <TextInput 
        style={[styles.input, erros.nome && styles.inputError]} 
        placeholder="Nome Completo" 
        value={nome} 
        onChangeText={(texto) => { setNome(texto); setErros({...erros, nome: null}); }} 
        editable={!loading} 
      />
      {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}

      <TouchableOpacity 
        style={[styles.input, erros.titulacao && styles.inputError, { justifyContent: 'center' }]} 
        activeOpacity={0.7}
        onPress={() => {
          if (!loading) {
            setShowTitulacao(!showTitulacao);
            setShowCursoDropdown(false);
          }
        }}
      >
        <Text style={{ color: titulacao ? '#333' : '#999' }}>
          {titulacao || 'Selecione a Titulação'}
        </Text>
      </TouchableOpacity>
      {erros.titulacao && <Text style={styles.errorText}>{erros.titulacao}</Text>}
      
      {showTitulacao && (
        <View style={styles.dropdown}>
          {opcoesTitulacao.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.dropdownItem} 
              onPress={() => {
                setTitulacao(item);
                setErros({ ...erros, titulacao: null });
                setShowTitulacao(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* CAMPO CURSO VINCULADO AO BANCO DE DADOS */}
      <TouchableOpacity 
        style={[styles.input, erros.curso && styles.inputError, { justifyContent: 'center' }]} 
        activeOpacity={0.7}
        onPress={() => {
          if (!loading && !loadingCursos && cursos.length > 0) {
            setShowCursoDropdown(!showCursoDropdown);
            setShowTitulacao(false);
          } else if (cursos.length === 0 && !loadingCursos) {
            Alert.alert('Aviso', 'Nenhum curso encontrado no banco.');
          }
        }}
      >
        {loadingCursos ? (
          <Text style={{ color: '#999' }}>A carregar cursos...</Text>
        ) : (
          <Text style={{ color: curso ? '#333' : '#999' }}>
            {curso || 'Selecione o Curso'}
          </Text>
        )}
      </TouchableOpacity>
      {erros.curso && <Text style={styles.errorText}>{erros.curso}</Text>}

      {showCursoDropdown && (
        <View style={styles.dropdown}>
          {cursos.map((c) => (
            <TouchableOpacity 
              key={c.id} 
              style={styles.dropdownItem} 
              onPress={() => {
                setCurso(c.nome);
                setErros({ ...erros, curso: null });
                setShowCursoDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{c.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TextInput 
        style={[styles.input, erros.tempoDocencia && styles.inputError]} 
        placeholder="Tempo de Docência (anos)" 
        value={tempoDocencia} 
        onChangeText={(texto) => { 
          const apenasNumeros = texto.replace(/[^0-9]/g, ''); 
          setTempoDocencia(apenasNumeros); 
          setErros({...erros, tempoDocencia: null}); 
        }} 
        keyboardType="numeric" 
        editable={!loading} 
      />
      {erros.tempoDocencia && <Text style={styles.errorText}>{erros.tempoDocencia}</Text>}

      <TextInput 
        style={[styles.input, erros.email && styles.inputError]} 
        placeholder="Email" 
        value={email} 
        onChangeText={(texto) => { setEmail(texto); setErros({...erros, email: null}); }} 
        keyboardType="email-address" 
        autoCapitalize="none"
        editable={!loading} 
      />
      {erros.email && <Text style={styles.errorText}>{erros.email}</Text>}

      <TextInput 
        style={[styles.input, styles.inputBloqueado]} 
        value={`${senhaGerada}`} 
        editable={false} 
      />
      <Text style={styles.avisoText}>* Informe esta senha ao professor para o primeiro acesso.</Text>

      {mensagemSucesso !== '' && (
        <View style={styles.sucessoContainer}>
          <Text style={styles.sucessoText}>{mensagemSucesso}</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleCadastro} disabled={loading} >
        <Text style={styles.buttonText}>{loading ? 'SALVANDO...' : 'SALVAR DADOS'}</Text>
      </TouchableOpacity>
      
      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#eee', color: '#333' },
  
  inputBloqueado: {
    backgroundColor: '#e9ecef',
    color: '#1a1a1a',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  avisoText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 15,
    marginLeft: 4,
  },

  inputError: { borderColor: '#dc3545', backgroundColor: '#fff8f8' },
  errorText: { color: '#dc3545', fontSize: 13, marginTop: -8, marginBottom: 10, marginLeft: 4, fontWeight: '500' },
  dropdown: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: -8, marginBottom: 12, overflow: 'hidden', elevation: 2 },
  dropdownItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 15, color: '#333' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#94d3a2' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sucessoContainer: { backgroundColor: '#d4edda', borderColor: '#c3e6cb', borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  sucessoText: { color: '#155724', fontWeight: 'bold', fontSize: 15 }
});