//1. Import do Express
const express = require('express');

//2. Criando Aplicação
const app = express();

//3. Definindo porta
const PORT = 3000;

// 4. Middleware para JSON
app.use(express.json());

// 5. Criar primeiro endpoint
app.get('/', (req, res) => {
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

// Dados em memória
let filmes = [
    { id: 1, nome: "Avatar (2009)", arrecadacao: 2.923 , categoria: "14 anos (BR) / PG-13 (EUA)", duracao:177  },
    { id: 2, nome: "Vingadores Ultimato", arrecadacao: 2.799, categoria: "12 anos (BR) / PG-13 (EUA)", duracao:181 },
    { id: 3, nome: "Titanic", arrecadacao: 2.264, categoria: "13 anos (BR) / PG-13 (EUA)", duracao:194 },
    { id: 4, nome: "Rei Leão", arrecadacao: 1.663, categoria: "Livre L", duracao:89 }
];

// GET /api/filmes - Listar com filtros, ordenação e paginação
app.get('/api/filmes', (req, res) => {
    const { categoria, arrecadacao_max, arrecadacao_min, ordem, direcao, pagina = 1, limite = 10 } = req.query;
    
    let resultado = filmes;
    
    // Filtros
    if (categoria) resultado = resultado.filter(f => f.categoria === categoria);
    if (arrecadacao_max) resultado = resultado.filter(f => f.arrecadacao <= parseFloat(arrecadacao_max));
    if (arrecadacao_min) resultado = resultado.filter(f => f.arrecadacao >= parseFloat(arrecadacao_min));
    
    // Ordenação
    if (ordem) {
        resultado = resultado.sort((a, b) => {
            if (ordem === 'arrecadacao') {
                return direcao === 'desc' ? b.arrecadacao - a.arrecadacao : a.arrecadacao - b.arrecadacao;
            }
            if (ordem === 'nome') {
                return direcao === 'desc' ? b.nome.localeCompare(a.nome) : a.nome.localeCompare(b.nome);
            }
        });
    }
    
    // Paginação
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    const inicio = (paginaNum - 1) * limiteNum;
    const paginado = resultado.slice(inicio, inicio + limiteNum);
    
    res.json({
        dados: paginado,
        paginacao: {
            pagina_atual: paginaNum,
            itens_por_pagina: limiteNum,
            total_itens: resultado.length,
            total_paginas: Math.ceil(resultado.length / limiteNum)
        }
    });
});

// GET /api/filmes/:id - Buscar por ID
app.get('/api/filmes/:id', (req, res) => {
    const filme = filmes.find(f => f.id === parseInt(req.params.id));
    if (!filme) return res.status(404).json({ erro: "Filme não encontrado" });
    res.json(filme);
});

app.listen(3000, () => console.log('🚀 API rodando na porta 3000'));

// 8. Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
                        