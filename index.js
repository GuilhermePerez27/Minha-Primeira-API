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

// POST /api/filmes - Criar novo filme
app.post('/api/filmes', (req, res) => {
    // 1. Pegar dados do body
    const { nome, arrecadacao, categoria, duracao } = req.body;
    
    // 2. Validações
    if (!nome || !arrecadacao || !categoria || !duracao) {
        return res.status(400).json({
            erro: "Campos obrigatórios: nome, arrecadacao, categoria, duracao"
        });
    }

    if (typeof arrecadacao !== 'number' || arrecadacao <= 0) {
        return res.status(400).json({
            erro: "Arrecadação deve ser um número positivo"
        });
    }

    if (typeof duracao !== 'number' || duracao <= 0) {
        return res.status(400).json({
            erro: "Duração deve ser um número positivo"
        });
    }
    
    // 3. Gerar novo ID (simples)
    const novoId = filmes.length > 0 ? Math.max(...filmes.map(f => f.id)) + 1 : 1;
    
    // 4. Criar novo filme
    const novoFilme = {
        id: novoId,
        nome,
        arrecadacao,
        categoria,
        duracao
    };
    
    // 5. Adicionar ao array
    filmes.push(novoFilme);
    
    // 6. Retornar filme criado
    res.status(201).json(novoFilme);
});

// PUT /api/filmes/:id - Atualizar filme
app.put('/api/filmes/:id', (req, res) => {
    // 1. Pegar ID da URL
    const id = parseInt(req.params.id);
    
    // 2. Buscar filme no array
    const filme = filmes.find(f => f.id === id);
    
    // 3. Verificar se existe
    if (!filme) {
        return res.status(404).json({ 
            erro: "Filme não encontrado" 
        });
    }
    
    // 4. Extrair dados do body
    const { nome, arrecadacao, categoria, duracao } = req.body;
    
    // 5. Validações
    if (!nome || !arrecadacao || !categoria || !duracao) {
        return res.status(400).json({
            erro: "Campos obrigatórios: nome, arrecadacao, categoria, duracao"
        });
    }
    
    if (typeof arrecadacao !== 'number' || arrecadacao <= 0) {
        return res.status(400).json({
            erro: "Arrecadação deve ser um número positivo"
        });
    }

    if (typeof duracao !== 'number' || duracao <= 0) {
        return res.status(400).json({
            erro: "Duração deve ser um número positivo"
        });
    }
    
    // 6. Atualizar dados do filme
    filme.nome = nome;
    filme.arrecadacao = arrecadacao;
    filme.categoria = categoria;
    filme.duracao = duracao;
    
    // 7. Retornar filme atualizado
    res.json(filme);
});

// DELETE /api/filmes/:id - Remover filme
app.delete('/api/filmes/:id', (req, res) => {
    // 1. Pegar ID da URL
    const id = parseInt(req.params.id);
    
    // 2. Encontrar índice do filme no array
    const index = filmes.findIndex(f => f.id === id);
    
    // 3. Verificar se existe
    if (index === -1) {
        return res.status(404).json({ 
            erro: "Filme não encontrado" 
        });
    }
    
    // 4. Remover do array
    filmes.splice(index, 1);
    
    // 5. Retornar 204 No Content (sem body)
    res.status(204).send();
});

app.listen(3000, () => console.log('🚀 API rodando na porta 3000'));

// 8. Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});