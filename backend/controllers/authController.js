require('dotenv').config(); // Carrega as credenciais secretas do ficheiro .env
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { email, senha } = req.body;
  
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
  
  // 2. ESPAÇO PARA A LÓGICA DE ALUNOS E PROFESSORES

  // Se não for admin e não for achado no banco, devolve erro:
  return res.status(401).json({ error: 'Credenciais inválidas. E-mail ou senha incorretos.' });
};