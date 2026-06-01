const pool = require('../database/db');

// Cadastro de Alunos
exports.cadastrarAluno = async (req, res) => {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, senha } = req.body;
  
  try {
    let errosValidacao = {};

    const verificaMatricula = await pool.query('SELECT id FROM alunos WHERE matricula = $1', [matricula]);
    if (verificaMatricula.rowCount > 0) errosValidacao.matricula = 'Esta matrícula já está cadastrada.';

    const verificaEmail = await pool.query('SELECT id FROM alunos WHERE email = $1', [email]);
    if (verificaEmail.rowCount > 0) errosValidacao.email = 'Este e-mail já está cadastrado para outro aluno.';

    const verificaTelefone = await pool.query('SELECT id FROM alunos WHERE telefone = $1', [telefone]);
    if (verificaTelefone.rowCount > 0) errosValidacao.telefone = 'Este telefone já está cadastrado para outro aluno.';

    if (Object.keys(errosValidacao).length > 0) {
      return res.status(400).json({ errosMultiplos: errosValidacao });
    }

    // 2. Insere a senha no BD
    const query = `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, senha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    await pool.query(query, [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, senha]);
    
    res.status(201).json({ message: 'Aluno cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cadastro de Professores
exports.cadastrarProfessor = async (req, res) => {
  const { nome, titulacao, areaAtuacao, tempoDocencia, email, senha } = req.body; 
  try {
    const verificaEmail = await pool.query('SELECT id FROM professores WHERE email = $1', [email]);
    if (verificaEmail.rowCount > 0) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado para outro professor.' });
    }

    // 2. Insere a senha no BD
    const query = `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email, senha) VALUES ($1, $2, $3, $4, $5, $6)`;
    await pool.query(query, [nome, titulacao, areaAtuacao, tempoDocencia, email, senha]);
    
    res.status(201).json({ message: 'Professor cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cadastro de Disciplinas
exports.cadastrarDisciplina = async (req, res) => {
  const { nomeDisciplina, cargaHoraria, professorResponsavel, curso, semestre } = req.body;
  try {
    let errosValidacao = {};

    // Verifica se a disciplina já existe DENTRO DO MESMO CURSO
    const verificaDisciplinaCurso = await pool.query(
      'SELECT id FROM disciplinas WHERE nome = $1 AND curso = $2', 
      [nomeDisciplina, curso]
    );
    
    // Se encontrou, aponta o erro para os DOIS campos para destacar no telemóvel
    if (verificaDisciplinaCurso.rowCount > 0) {
      errosValidacao.nomeDisciplina = 'Esta disciplina já existe neste curso.';
      errosValidacao.curso = 'Este curso já possui esta disciplina.';
    }

    // Devolve os erros se existirem e interrompe
    if (Object.keys(errosValidacao).length > 0) {
      return res.status(400).json({ errosMultiplos: errosValidacao });
    }

    // Se passou, faz o cadastro!
    const query = `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre) VALUES ($1, $2, $3, $4, $5)`;
    await pool.query(query, [nomeDisciplina, cargaHoraria, professorResponsavel, curso, semestre]);
    
    res.status(201).json({ message: 'Disciplina cadastrada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Consulta de Boletim
exports.consultarBoletim = async (req, res) => {
  const { matricula } = req.params;
  res.json({
    aluno: "Maria Souza",
    disciplinas: [
      { disciplina: "Programação Mobile", nota1: 8, nota2: 7, media: 7.5, situacao: "Aprovado" }
    ]
  });
};

// Listar Professores
exports.listarProfessores = async (req, res) => {
  try {
    // Busca apenas o ID e o Nome de todos os professores cadastrados
    const result = await pool.query('SELECT id, nome FROM professores ORDER BY nome ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Gerar próxima Matrícula de Aluno
exports.gerarProximaMatricula = async (req, res) => {
  try {
    // Procura a matrícula com o maior número (ex: RA005)
    const result = await pool.query(`
      SELECT matricula 
      FROM alunos 
      WHERE matricula LIKE 'RA%' 
      ORDER BY id DESC 
      LIMIT 1
    `);

    let proximaMatricula = 'RA001'; // Valor padrão se a tabela estiver vazia

    if (result.rows.length > 0) {
      const ultimaMatricula = result.rows[0].matricula; // ex: "RA005"
      const numeroAtual = parseInt(ultimaMatricula.replace('RA', ''), 10); // Extrai o "5"
      const proximoNumero = numeroAtual + 1; // Soma +1 (fica 6)
      
      // Formata de volta para ter 3 dígitos (ex: RA006)
      proximaMatricula = `RA${proximoNumero.toString().padStart(3, '0')}`;
    }

    res.status(200).json({ matricula: proximaMatricula });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar Cursos cadastrados no banco de dados
exports.listarCursos = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM cursos ORDER BY nome ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar Disciplinas
exports.listarDisciplinas = async (req, res) => {
  try {
    // Busca todas as disciplinas no banco
    const result = await pool.query('SELECT * FROM disciplinas');
    
    // Retorna a lista em formato JSON
    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar disciplinas:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar as disciplinas.' });
  }
};