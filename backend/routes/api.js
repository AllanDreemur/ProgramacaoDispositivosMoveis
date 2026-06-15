const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const academicController = require('../controllers/academicController');

router.post('/login', authController.login);

// --- ROTAS DE ALUNOS ---
router.get('/alunos/nova-matricula', academicController.gerarProximaMatricula);
router.post('/alunos', academicController.cadastrarAluno);
router.get('/alunos', academicController.listarAlunos); //

// --- ROTAS DE PROFESSORES ---
router.post('/professores', academicController.cadastrarProfessor);
router.get('/professores', academicController.listarProfessores);

// --- ROTAS GERAIS E DISCIPLINAS ---
router.get('/cursos', academicController.listarCursos);
router.post('/disciplinas', academicController.cadastrarDisciplina);
router.get('/disciplinas', academicController.listarDisciplinas);

// --- ROTAS DE NOTAS E BOLETIM ---
router.post('/notas', academicController.cadastrarNota); //
router.get('/boletim/:matricula', academicController.consultarBoletim);
router.get('/notas', academicController.listarNotas);

// --- ROTAS DE AVISOS ACADÊMICOS ---
router.post('/avisos', academicController.cadastrarAviso);
router.get('/avisos', academicController.listarAvisos);
router.delete('/avisos/:id', academicController.excluirAviso);

module.exports = router;