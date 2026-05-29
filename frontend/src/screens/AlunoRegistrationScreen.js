import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function AlunoRegistrationScreen() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // 1. ESTADOS DE CONTROLO DE UI E ERROS
  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erros, setErros] = useState({});

  // 2. FUNÇÃO DE VALIDAÇÃO
  const validarCampos = () => {
    let novosErros = {};

    if (!nome.trim()) novosErros.nome = 'O nome é obrigatório.';
    else if (nome.trim().length < 3) novosErros.nome = 'O nome deve ter pelo menos 3 caracteres.';

    if (!matricula.trim()) novosErros.matricula = 'A matrícula é obrigatória.';
    if (!curso.trim()) novosErros.curso = 'O curso é obrigatório.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) novosErros.email = 'O e-mail é obrigatório.';
    else if (!emailRegex.test(email)) novosErros.email = 'Digite um e-mail válido.';

    if (!telefone.trim()) novosErros.telefone = 'O telefone é obrigatório.';

    if (!cep.trim()) novosErros.cep = 'O CEP é obrigatório.';
    else if (cep.trim().length !== 8) novosErros.cep = 'O CEP deve ter 8 dígitos (apenas números).';

    if (!endereco.trim()) novosErros.endereco = 'O endereço é obrigatório.';
    if (!cidade.trim()) novosErros.cidade = 'A cidade é obrigatória.';
    if (!estado.trim()) novosErros.estado = 'O estado é obrigatório.';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // 3. INTEGRAÇÃO VIACEP ATUALIZADA COM TRATAMENTO DE ERRO
  const buscarCep = async () => {
    const cepLimpo = cep.trim(); 
    if (cepLimpo.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        if (!response.data.erro) {
          setEndereco(response.data.logradouro);
          setCidade(response.data.localidade);
          setEstado(response.data.uf);
          
          // Limpa os erros de endereço que pudessem estar no ecrã
          setErros(prev => ({ ...prev, cep: null, endereco: null, cidade: null, estado: null }));
        } else {
          setErros(prev => ({ ...prev, cep: 'CEP não encontrado.' }));
        }
      } catch (error) {
        setErros(prev => ({ ...prev, cep: 'Falha ao buscar o CEP.' }));
      }
    }
  };

  // 4. ENVIO PARA O BACKEND
  const handleCadastro = async () => {
    setMensagemSucesso('');

    // Verifica se há erros antes de enviar
    if (!validarCampos()) {
      return; 
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/alunos', { 
        nome, matricula, curso, email, telefone, cep, endereco, cidade, estado 
      });
      
      // Limpa os campos
      setNome('');
      setMatricula('');
      setCurso('');
      setEmail('');
      setTelefone('');
      setCep('');
      setEndereco('');
      setCidade('');
      setEstado('');
      setErros({});

      setMensagemSucesso('Aluno cadastrado com sucesso!');
      
      setTimeout(() => {
        setMensagemSucesso('');
      }, 3000);

    } catch (error) {
      const mensagemErro = error.response?.data?.error || 'Falha ao gravar os dados do aluno no servidor.';
      Alert.alert('Erro no Servidor', mensagemErro);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dados do Aluno</Text>
      
      {/* Campo Nome */}
      <TextInput style={[styles.input, erros.nome && styles.inputError]} placeholder="Nome Completo" value={nome} onChangeText={(texto) => { setNome(texto); setErros({...erros, nome: null}); }} editable={!loading} />
      {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}

      {/* Campo Matrícula */}
      <TextInput style={[styles.input, erros.matricula && styles.inputError]} placeholder="Matrícula" value={matricula} onChangeText={(texto) => { setMatricula(texto); setErros({...erros, matricula: null}); }} editable={!loading} />
      {erros.matricula && <Text style={styles.errorText}>{erros.matricula}</Text>}

      {/* Campo Curso */}
      <TextInput style={[styles.input, erros.curso && styles.inputError]} placeholder="Curso" value={curso} onChangeText={(texto) => { setCurso(texto); setErros({...erros, curso: null}); }} editable={!loading} />
      {erros.curso && <Text style={styles.errorText}>{erros.curso}</Text>}

      {/* Campo E-mail */}
      <TextInput style={[styles.input, erros.email && styles.inputError]} placeholder="Email" value={email} onChangeText={(texto) => { setEmail(texto); setErros({...erros, email: null}); }} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
      {erros.email && <Text style={styles.errorText}>{erros.email}</Text>}

      {/* Campo Telefone */}
      <TextInput style={[styles.input, erros.telefone && styles.inputError]} placeholder="Telefone" value={telefone} onChangeText={(texto) => { setTelefone(texto); setErros({...erros, telefone: null}); }} keyboardType="phone-pad" editable={!loading} />
      {erros.telefone && <Text style={styles.errorText}>{erros.telefone}</Text>}

      {/* Campo CEP*/}
      <TextInput 
        style={[styles.input, erros.cep && styles.inputError]} 
        placeholder="CEP (Apenas números)" 
        value={cep} 
        onChangeText={(texto) => { setCep(texto); setErros({...erros, cep: null}); }} 
        keyboardType="number-pad" 
        onBlur={buscarCep}
        editable={!loading} 
      />
      {erros.cep && <Text style={styles.errorText}>{erros.cep}</Text>}

      {/* Campo Endereço */}
      <TextInput style={[styles.input, erros.endereco && styles.inputError]} placeholder="Endereço" value={endereco} onChangeText={(texto) => { setEndereco(texto); setErros({...erros, endereco: null}); }} editable={!loading} />
      {erros.endereco && <Text style={styles.errorText}>{erros.endereco}</Text>}

      {/* Campo Cidade */}
      <TextInput style={[styles.input, erros.cidade && styles.inputError]} placeholder="Cidade" value={cidade} onChangeText={(texto) => { setCidade(texto); setErros({...erros, cidade: null}); }} editable={!loading} />
      {erros.cidade && <Text style={styles.errorText}>{erros.cidade}</Text>}

      {/* Campo Estado */}
      <TextInput style={[styles.input, erros.estado && styles.inputError]} placeholder="Estado (Ex: SP)" value={estado} onChangeText={(texto) => { setEstado(texto); setErros({...erros, estado: null}); }} editable={!loading} />
      {erros.estado && <Text style={styles.errorText}>{erros.estado}</Text>}

      {/* MENSAGEM DE SUCESSO VERDE */}
      {mensagemSucesso !== '' && (
        <View style={styles.sucessoContainer}>
          <Text style={styles.sucessoText}>{mensagemSucesso}</Text>
        </View>
      )}

      {/* BOTÃO SALVAR */}
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