//1. Import do Express
const express = require('express');

//2. Criando Aplicação
const app = express();

//3. Definindo porta
const PORT = 80;

// 4. Middleware para JSON
app.use(express.json());

// 5. Criar primeiro endpoint
app.get('/dados/1', (req, res) => {
    res.json({
        mensagem: '🎉 Minha primeira API funcionando!',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// 6. Endpoint de informações
app.get('/dados', (req, res) => {
    res.json({
        nome: 'Minha API REST',
        versao: '1.0.0',
        autor: 'Guilherme Perez',
        descricao: 'Esta é uma API de exemplo para aprender'
    });
});

// 7. Endpoint teste
app.get('/info', (req, res) => {
    res.json({
        nome: 'Teste de Endpoint API REST',
        versao: '1.0.0',
        autor: 'Guilherme Perez'
    });
});

// 8. Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});