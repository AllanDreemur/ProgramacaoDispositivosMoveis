const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const academicController = require('../controllers/academicController');

router.post('/login', authController.login);
router.get('/alunos/nova-matricula', academicController.gerarProximaMatricula);
router.post('/alunos', academicController.cadastrarAluno);
router.post('/professores', academicController.cadastrarProfessor);
router.get('/professores', academicController.listarProfessores);

router.get('/cursos', academicController.listarCursos);

router.post('/disciplinas', academicController.cadastrarDisciplina);
router.get('/boletim/:matricula', academicController.consultarBoletim);

module.exports = router;