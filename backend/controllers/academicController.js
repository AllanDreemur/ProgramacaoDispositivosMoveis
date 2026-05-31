const pool = require('../database/db');

// Cadastro de Alunos
exports.cadastrarAluno = async (req, res) => {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;
  try {
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
    const query = `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre) VALUES ($1, $2, $3, $4, $5)`;
    await pool.query(query, [nomeDisciplina, parseInt(cargaHoraria), parseInt(professorResponsavel), curso, semestre]);
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