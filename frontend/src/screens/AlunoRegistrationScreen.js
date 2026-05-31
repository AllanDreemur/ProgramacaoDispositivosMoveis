import React, { useState, useEffect } from 'react';
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

  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erros, setErros] = useState({});

  // ESTADOS DO DROPDOWN DE CURSOS
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [showCursoDropdown, setShowCursoDropdown] = useState(false);

  // ESTADOS DO DROPDOWN DE ESTADOS (UF)
  const [showEstadoDropdown, setShowEstadoDropdown] = useState(false);
  const opcoesEstado = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const fetchNovaMatricula = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/alunos/nova-matricula');
      setMatricula(response.data.matricula);
    } catch (error) {
      console.log("Erro ao gerar matrícula:", error);
      Alert.alert('Erro', 'Não foi possível gerar a matrícula automaticamente.');
    }
  };

  useEffect(() => {
    fetchNovaMatricula();

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

    if (!matricula.trim()) novosErros.matricula = 'A matrícula é obrigatória.';
    if (!curso) novosErros.curso = 'O curso é obrigatório.';

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

  const buscarCep = async () => {
    const cepLimpo = cep.trim(); 
    if (cepLimpo.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        if (!response.data.erro) {
          setEndereco(response.data.logradouro);
          setCidade(response.data.localidade);
          setEstado(response.data.uf); // O ViaCEP preenche automaticamente o Dropdown!
          setErros(prev => ({ ...prev, cep: null, endereco: null, cidade: null, estado: null }));
        } else {
          setErros(prev => ({ ...prev, cep: 'CEP não encontrado.' }));
        }
      } catch (error) {
        setErros(prev => ({ ...prev, cep: 'Falha ao buscar o CEP.' }));
      }
    }
  };

  const handleCadastro = async () => {
    setMensagemSucesso('');
    setShowCursoDropdown(false);
    setShowEstadoDropdown(false);

    if (!validarCampos()) {
      return; 
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/alunos', { 
        nome, matricula, curso, email, telefone, cep, endereco, cidade, estado 
      });
      
      setNome('');
      setCurso('');
      setEmail('');
      setTelefone('');
      setCep('');
      setEndereco('');
      setCidade('');
      setEstado('');
      setErros({});

      setMensagemSucesso('Aluno cadastrado com sucesso!');
      
      await fetchNovaMatricula(); 
      
      setTimeout(() => {
        setMensagemSucesso('');
      }, 3000);

    } catch (error) {
      if (error.response?.data?.errosMultiplos) {
        const errosDoBackend = error.response.data.errosMultiplos;
        setErros(prev => ({ ...prev, ...errosDoBackend }));
      } else {
        const mensagemErro = error.response?.data?.error || 'Falha ao gravar os dados do aluno no servidor.';
        Alert.alert('Erro no Servidor', mensagemErro);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Dados do Aluno</Text>
      
      <TextInput 
        style={[styles.input, erros.nome && styles.inputError]} 
        placeholder="Nome Completo" 
        value={nome} 
        onChangeText={(texto) => { setNome(texto); setErros({...erros, nome: null}); }} 
        editable={!loading} 
      />
      {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}

      <TextInput 
        style={[styles.input, styles.inputBloqueado, erros.matricula && styles.inputError]} 
        placeholder="Matrícula gerada automaticamente" 
        value={matricula} 
        editable={false}
      />
      {erros.matricula && <Text style={styles.errorText}>{erros.matricula}</Text>}

      {/* CAMPO CURSO (Dropdown) */}
      <TouchableOpacity 
        style={[styles.input, erros.curso && styles.inputError, { justifyContent: 'center' }]} 
        activeOpacity={0.7}
        onPress={() => {
          if (!loading && !loadingCursos && cursos.length > 0) {
            setShowCursoDropdown(!showCursoDropdown);
            setShowEstadoDropdown(false);
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
        style={[styles.input, erros.email && styles.inputError]} 
        placeholder="Email" 
        value={email} 
        onChangeText={(texto) => { setEmail(texto); setErros({...erros, email: null}); }} 
        keyboardType="email-address" 
        autoCapitalize="none" 
        editable={!loading} 
      />
      {erros.email && <Text style={styles.errorText}>{erros.email}</Text>}

      {/* CAMPO TELEFONE */}
      <TextInput 
        style={[styles.input, erros.telefone && styles.inputError]} 
        placeholder="Telefone" 
        value={telefone} 
        onChangeText={(texto) => { 
          const apenasNumeros = texto.replace(/[^0-9]/g, '');
          setTelefone(apenasNumeros); 
          setErros({...erros, telefone: null}); 
        }} 
        keyboardType="phone-pad" 
        editable={!loading} 
      />
      {erros.telefone && <Text style={styles.errorText}>{erros.telefone}</Text>}

      {/* CAMPO CEP */}
      <TextInput 
        style={[styles.input, erros.cep && styles.inputError]} 
        placeholder="CEP (Apenas números)" 
        value={cep} 
        onChangeText={(texto) => { 
          const apenasNumeros = texto.replace(/[^0-9]/g, '');
          setCep(apenasNumeros); 
          setErros({...erros, cep: null}); 
        }} 
        keyboardType="number-pad" 
        onBlur={buscarCep}
        editable={!loading} 
      />
      {erros.cep && <Text style={styles.errorText}>{erros.cep}</Text>}

      <TextInput style={[styles.input, erros.endereco && styles.inputError]} placeholder="Endereço" value={endereco} onChangeText={(texto) => { setEndereco(texto); setErros({...erros, endereco: null}); }} editable={!loading} />
      {erros.endereco && <Text style={styles.errorText}>{erros.endereco}</Text>}

      <TextInput style={[styles.input, erros.cidade && styles.inputError]} placeholder="Cidade" value={cidade} onChangeText={(texto) => { setCidade(texto); setErros({...erros, cidade: null}); }} editable={!loading} />
      {erros.cidade && <Text style={styles.errorText}>{erros.cidade}</Text>}

      {/* CAMPO ESTADO (Dropdown) */}
      <TouchableOpacity 
        style={[styles.input, erros.estado && styles.inputError, { justifyContent: 'center' }]} 
        activeOpacity={0.7}
        onPress={() => {
          if (!loading) {
            setShowEstadoDropdown(!showEstadoDropdown);
            setShowCursoDropdown(false);
          }
        }}
      >
        <Text style={{ color: estado ? '#333' : '#999' }}>
          {estado || 'Selecione o Estado'}
        </Text>
      </TouchableOpacity>
      {erros.estado && <Text style={styles.errorText}>{erros.estado}</Text>}

      {showEstadoDropdown && (
        <View style={styles.dropdown}>
          <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
            {opcoesEstado.map((uf, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.dropdownItem} 
                onPress={() => {
                  setEstado(uf);
                  setErros({ ...erros, estado: null });
                  setShowEstadoDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{uf}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

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
  input: { 
    backgroundColor: '#f9f9f9', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#eee',
    color: '#333'
  },
  inputBloqueado: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
    fontWeight: 'bold'
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