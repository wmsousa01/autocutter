// server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; // Para logs de requisição
import processRoutes from './routes/process.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Log de requisições

// Rotas
app.use('/api', processRoutes);

// Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
