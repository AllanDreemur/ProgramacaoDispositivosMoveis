const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { email, senha } = req.body;
  
  if (email === 'teste@fatec.br' && senha === '123') {
    const token = jwt.sign({ id: 1, perfil: 'aluno' }, 'chave_secreta', { expiresIn: '1h' });
    
    return res.json({
      token: token,
      usuario: { nome: "João", perfil: "aluno" }
    });
  }
  return res.status(401).json({ error: 'Credenciais inválidas' });
};