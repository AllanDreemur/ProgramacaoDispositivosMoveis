const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const academicController = require('../controllers/academicController');

// Rota Autenticação
router.post('/login', authController.login);

// Rotas Acadêmicas
router.post('/alunos', academicController.cadastrarAluno);
router.post('/professores', academicController.cadastrarProfessor);
router.post('/disciplinas', academicController.cadastrarDisciplina);
router.get('/boletim/:matricula', academicController.consultarBoletim);

module.exports = router;