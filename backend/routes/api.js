const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const academicController = require('../controllers/academicController');

router.post('/login', authController.login);

// --- ROTAS DE ALUNOS ---
router.get('/alunos/nova-matricula', academicController.gerarProximaMatricula);
router.post('/alunos', academicController.cadastrarAluno);
router.get('/alunos', academicController.listarAlunos); // <-- NOVA ROTA ADICIONADA

// --- ROTAS DE PROFESSORES ---
router.post('/professores', academicController.cadastrarProfessor);
router.get('/professores', academicController.listarProfessores);

// --- ROTAS GERAIS E DISCIPLINAS ---
router.get('/cursos', academicController.listarCursos);
router.post('/disciplinas', academicController.cadastrarDisciplina);
router.get('/disciplinas', academicController.listarDisciplinas);

// --- ROTAS DE NOTAS E BOLETIM ---
router.post('/notas', academicController.cadastrarNota); // <-- NOVA ROTA ADICIONADA
router.get('/boletim/:matricula', academicController.consultarBoletim);

module.exports = router;