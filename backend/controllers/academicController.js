const pool = require('../database/db');

// Cadastro de Alunos
exports.cadastrarAluno = async (req, res) => {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;
  try {
    let errosValidacao = {};

    // 1. Verifica se a matrícula já existe
    const verificaMatricula = await pool.query('SELECT id FROM alunos WHERE matricula = $1', [matricula]);
    if (verificaMatricula.rowCount > 0) {
      errosValidacao.matricula = 'Esta matrícula já está cadastrada.';
    }

    // 2. Verifica se o e-mail já existe
    const verificaEmail = await pool.query('SELECT id FROM alunos WHERE email = $1', [email]);
    if (verificaEmail.rowCount > 0) {
      errosValidacao.email = 'Este e-mail já está cadastrado para outro aluno.';
    }

    // 3. Verifica se o telefone já existe
    const verificaTelefone = await pool.query('SELECT id FROM alunos WHERE telefone = $1', [telefone]);
    if (verificaTelefone.rowCount > 0) {
      errosValidacao.telefone = 'Este telefone já está cadastrado para outro aluno.';
    }

    // 4. Se encontrou ALGUM erro nas verificações, devolve TODOS de uma vez e pára aqui
    if (Object.keys(errosValidacao).length > 0) {
      return res.status(400).json({ errosMultiplos: errosValidacao });
    }

    // Se não encontrou nenhum erro, faz o cadastro!
    const query = `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    await pool.query(query, [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado]);
    
    res.status(201).json({ message: 'Aluno cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cadastro de Professores
exports.cadastrarProfessor = async (req, res) => {
  const { nome, titulacao, areaAtuacao, tempoDocencia, email } = req.body; 
  try {
    const verificaEmail = await pool.query('SELECT id FROM professores WHERE email = $1', [email]);
    
    // Se encontrou algum registo (rowCount > 0), bloqueia o cadastro e devolve erro 400
    if (verificaEmail.rowCount > 0) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado para outro professor.' });
    }

    // 2. Se não existir, faz o cadastro normalmente
    const query = `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email) VALUES ($1, $2, $3, $4, $5)`;
    await pool.query(query, [nome, titulacao, areaAtuacao, tempoDocencia, email]);
    
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
