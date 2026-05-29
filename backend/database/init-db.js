const { Client, Pool } = require('pg');

// Configurações de conexão
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  password: '123',
  port: 5432,
};

const targetDbName = 'app_scholar';

// Script SQL
const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    matricula VARCHAR(50) UNIQUE,
    curso VARCHAR(100),
    email VARCHAR(255),
    telefone VARCHAR(20),
    cep VARCHAR(10),
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2)
  );

  CREATE TABLE IF NOT EXISTS professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    titulacao VARCHAR(100),
    area VARCHAR(100),
    tempo_docencia INT,
    email VARCHAR(255)
  );

  CREATE TABLE IF NOT EXISTS disciplinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    carga_horaria INT,
    professor_id INT REFERENCES professores(id),
    curso VARCHAR(100),
    semestre VARCHAR(50)
  );

  CREATE TABLE IF NOT EXISTS notas (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES alunos(id),
    disciplina_id INT REFERENCES disciplinas(id),
    nota1 NUMERIC(5,2),
    nota2 NUMERIC(5,2),
    media NUMERIC(5,2),
    situacao VARCHAR(50)
  );
`;

async function createDatabaseIfNotExists() {
  const client = new Client({
    ...dbConfig,
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log('🔍 Verificando a existência do banco de dados...');

    // Verifica se o app_scholar já existe
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${targetDbName}'`);

    if (res.rowCount === 0) {
      console.log(`⏳ Criando o banco de dados "${targetDbName}"...`);
      await client.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`✅ Banco de dados "${targetDbName}" criado com sucesso!`);
    } else {
      console.log(`✅ O banco de dados "${targetDbName}" já existe.`);
    }
  } catch (err) {
    console.error('❌ Erro ao verificar ou criar o banco de dados:', err.message);
    throw err;
  } finally {
    await client.end();
  }
}

async function createTables() {
  const pool = new Pool({
    ...dbConfig,
    database: targetDbName,
  });

  try {
    console.log('⏳ Conectando ao banco de dados para criar as tabelas...');
    await pool.query(createTablesQuery);
    console.log('✅ Tabelas criadas/verificadas com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao criar as tabelas:', err.message);
  } finally {
    await pool.end();
  }
}

async function init() {
  try {
    await createDatabaseIfNotExists();
    await createTables();
    console.log('🎉 Inicialização do banco de dados concluída com sucesso!');
  } catch (err) {
    console.error('❌ Falha na inicialização do banco de dados.');
  }
}

init();