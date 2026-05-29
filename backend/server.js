const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta http://localhost:${PORT}`);
});