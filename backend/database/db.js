const { Pool } = require('pg');

// Substitua com as credenciais do seu PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'app_scholar', // Crie este banco vazio no pgAdmin antes de rodar!
  password: '123',
  port: 5432,
});

module.exports = pool;