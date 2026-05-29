import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function ProfessorRegistrationScreen() {
  const [nome, setNome] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [tempoDocencia, setTempoDocencia] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false); 
  const [mensagemSucesso, setMensagemSucesso] = useState(''); 
  
  const [erros, setErros] = useState({});

  //FUNÇÃO DE VALIDAÇÃO
  const validarCampos = () => {
    let novosErros = {};

    // Validação do Nome
    if (!nome.trim()) {
      novosErros.nome = 'O nome é obrigatório.';
    } else if (nome.trim().length < 3) {
      novosErros.nome = 'O nome deve ter pelo menos 3 caracteres.';
    }

    // Validação da Titulação
    if (!titulacao.trim()) {
      novosErros.titulacao = 'A titulação é obrigatória.';
    }

    // Validação da Área de Atuação
    if (!areaAtuacao.trim()) {
      novosErros.areaAtuacao = 'A área de atuação é obrigatória.';
    }

    // Validação do Tempo de Docência (Tem de ser número)
    if (!tempoDocencia.trim()) {
      novosErros.tempoDocencia = 'O tempo de docência é obrigatório.';
    } else if (isNaN(tempoDocencia) || Number(tempoDocencia) < 0) {
      novosErros.tempoDocencia = 'Digite apenas números válidos (ex: 5).';
    }

    // Validação do E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      novosErros.email = 'O e-mail é obrigatório.';
    } else if (!emailRegex.test(email)) {
      novosErros.email = 'Digite um e-mail válido (ex: email@fatec.br).';
    }

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
      await axios.post('http://localhost:3000/api/professores', { 
        nome, titulacao, areaAtuacao, tempoDocencia, email 
      });
      
      // Limpa os campos
      setNome('');
      setTitulacao('');
      setAreaAtuacao('');
      setTempoDocencia('');
      setEmail('');
      setErros({});

      setMensagemSucesso('Professor cadastrado com sucesso!');
      
      setTimeout(() => {
        setMensagemSucesso('');
      }, 3000);

    } catch (error) {
      const mensagemErro = error.response?.data?.error || 'Não foi possível salvar o professor.';
      Alert.alert('Erro no Servidor', mensagemErro);
      console.log(error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dados do Professor</Text>
      
      {/* Campo Nome */}
      <TextInput 
        style={[styles.input, erros.nome && styles.inputError]} 
        placeholder="Nome Completo" 
        value={nome} 
        onChangeText={(texto) => { setNome(texto); setErros({...erros, nome: null}); }} 
        editable={!loading} 
      />
      {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}

      {/* Campo Titulação */}
      <TextInput 
        style={[styles.input, erros.titulacao && styles.inputError]} 
        placeholder="Titulação (Ex: Mestre, Doutor)" 
        value={titulacao} 
        onChangeText={(texto) => { setTitulacao(texto); setErros({...erros, titulacao: null}); }} 
        editable={!loading} 
      />
      {erros.titulacao && <Text style={styles.errorText}>{erros.titulacao}</Text>}

      {/* Campo Área de Atuação */}
      <TextInput 
        style={[styles.input, erros.areaAtuacao && styles.inputError]} 
        placeholder="Área de Atuação" 
        value={areaAtuacao} 
        onChangeText={(texto) => { setAreaAtuacao(texto); setErros({...erros, areaAtuacao: null}); }} 
        editable={!loading} 
      />
      {erros.areaAtuacao && <Text style={styles.errorText}>{erros.areaAtuacao}</Text>}

      {/* Campo Tempo de Docência */}
      <TextInput 
        style={[styles.input, erros.tempoDocencia && styles.inputError]} 
        placeholder="Tempo de Docência (anos)" 
        value={tempoDocencia} 
        onChangeText={(texto) => { setTempoDocencia(texto); setErros({...erros, tempoDocencia: null}); }} 
        keyboardType="numeric" 
        editable={!loading} 
      />
      {erros.tempoDocencia && <Text style={styles.errorText}>{erros.tempoDocencia}</Text>}

      {/* Campo E-mail */}
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
  
//ESTILOS DOS ERROS
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