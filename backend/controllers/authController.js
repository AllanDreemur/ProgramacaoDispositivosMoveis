require('dotenv').config(); 
const jwt = require('jsonwebtoken');
const pool = require('../database/db'); 

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    // 1. VERIFICAÇÃO DE ADMIN
    if (email === process.env.ADMIN_EMAIL && senha === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: 'admin', perfil: 'admin' }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2h' }
      );
      
      return res.json({
        token: token,
        usuario: { nome: "Administrador", perfil: "admin" }
      });
    }
    
    // 2. VERIFICAÇÃO DE PROFESSORES NO BANCO DE DADOS
    const professorQuery = await pool.query('SELECT * FROM professores WHERE email = $1', [email]);
    
    if (professorQuery.rows.length > 0) {
      const professor = professorQuery.rows[0];
      
      // Verificando a senha
      if (professor.senha === senha) {
        const token = jwt.sign(
          { id: professor.id, perfil: 'professor' }, 
          process.env.JWT_SECRET, 
          { expiresIn: '2h' }
        );
        
        return res.json({
          token: token,
          usuario: { id: professor.id, nome: professor.nome, perfil: 'professor', area: professor.area }
        });
      }
    }

    // 3. VERIFICAÇÃO DE ALUNOS NO BANCO DE DADOS
    const alunoQuery = await pool.query('SELECT * FROM alunos WHERE email = $1', [email]);
    
    if (alunoQuery.rows.length > 0) {
      const aluno = alunoQuery.rows[0];
      
      if (aluno.senha === senha) {
        const token = jwt.sign(
          { id: aluno.id, perfil: 'aluno' }, 
          process.env.JWT_SECRET, 
          { expiresIn: '2h' }
        );
        
        return res.json({
          token: token,
          usuario: { nome: aluno.nome, perfil: 'aluno' }
        });
      }
    }

    // Se chegou até aqui, não achou em lugar nenhum ou a senha está incorreta
    return res.status(401).json({ error: 'Credenciais inválidas. E-mail ou senha incorretos.' });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor ao tentar fazer login.' });
  }
};