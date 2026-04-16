// Import do Express
const express = require('express');

// Importa o banco
const db = require('./database');

// Importa JWT
const jwt = require('jsonwebtoken');

// Cria aplicação
const app = express();

// Middleware JSON
app.use(express.json());

// Chave secreta
const SECRET = "Roberto_Carlos";

// ================= ROTAS PÚBLICAS =================

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        mensagem: '🎉 API de Filmes funcionando!',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// Info
app.get('/info', (req, res) => {
    res.json({
        nome: 'API de Filmes',
        versao: '1.0.0',
        autor: 'Guilherme Perez'
    });
});

// ================= LOGIN =================

app.post('/login', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ erro: "Email obrigatório" });
    }

    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });

    res.json({ token });
});

// ================= MIDDLEWARE JWT =================

function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ erro: "Token não enviado" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ erro: "Token inválido" });
        }

        req.user = user;
        next();
    });
}

// ================= USUÁRIOS =================

app.post('/api/usuarios', (req, res) => {
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ erro: "Dados obrigatórios" });
    }

    const sql = `INSERT INTO usuarios (nome, email) VALUES (?, ?)`;

    db.run(sql, [nome, email], function(err) {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        res.status(201).json({
            id: this.lastID,
            nome,
            email
        });
    });
});

// ================= FILMES =================

// LISTAR COM PAGINAÇÃO
app.get('/api/filmes', (req, res) => {
    const { arrecadacao_max, page = 1 } = req.query;

    const limit = 10;
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM filmes";
    let params = [];

    if (arrecadacao_max) {
        sql += " WHERE arrecadacao <= ?";
        params.push(arrecadacao_max);
    }

    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        res.json(rows);
    });
});

// JOIN filmes + usuários
app.get('/api/filmes-com-usuario', (req, res) => {
    const sql = `
        SELECT filmes.*, usuarios.nome AS usuario_nome
        FROM filmes
        LEFT JOIN usuarios ON filmes.usuario_id = usuarios.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        res.json(rows);
    });
});

// BUSCAR POR ID
app.get('/api/filmes/:id', (req, res) => {
    db.get("SELECT * FROM filmes WHERE id = ?", [req.params.id], (err, row) => {

        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        if (!row) {
            return res.status(404).json({ erro: "Filme não encontrado" });
        }

        res.json(row);
    });
});

// CRIAR FILME (PROTEGIDO)
app.post('/api/filmes', autenticarToken, (req, res) => {

    const { nome, arrecadacao, categoria, duracao, usuario_id } = req.body;

    if (!nome || !arrecadacao || !categoria || !duracao) {
        return res.status(400).json({ erro: "Campos obrigatórios" });
    }

    const sql = `
        INSERT INTO filmes (nome, arrecadacao, categoria, duracao, usuario_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [nome, arrecadacao, categoria, duracao, usuario_id], function(err) {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        res.status(201).json({
            id: this.lastID,
            nome,
            arrecadacao,
            categoria,
            duracao,
            usuario_id
        });
    });
});

// ATUALIZAR
app.put('/api/filmes/:id', (req, res) => {
    const { nome, arrecadacao, categoria, duracao } = req.body;

    const sql = `
        UPDATE filmes
        SET nome = ?, arrecadacao = ?, categoria = ?, duracao = ?
        WHERE id = ?
    `;

    db.run(sql, [nome, arrecadacao, categoria, duracao, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ erro: "Filme não encontrado" });
        }

        res.json({ mensagem: "Filme atualizado" });
    });
});

// DELETE
app.delete('/api/filmes/:id', (req, res) => {
    db.run("DELETE FROM filmes WHERE id = ?", [req.params.id], function(err) {

        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ erro: "Filme não encontrado" });
        }

        res.json({ mensagem: "Filme removido" });
    });
});

// PORTA
const PORT = process.env.PORT || 3000;

// START
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});