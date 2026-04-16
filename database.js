const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('test.db');

// SQL para criar tabela
const createTableSQL = `
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100) NOT NULL,
        arrecadacao DECIMAL(10,2) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        duracao DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )
        `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS filmes (
            nome VARCHAR(100) NOT NULL,
            arrecadacao DECIMAL(10,2) NOT NULL,
            categoria VARCHAR(50) NOT NULL,
            duracao DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            usuario_id INTEGER,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    `)

    db.all("PRAGMA table_info(filmes);", (err, columns) => {
        if (err) return console.error(err);

        const exists = columns.some(col => col.name === "usuario_id");

        if (!exists) {
        db.run("ALTER TABLE filmes ADD COLUMN usuario_id INTEGER;");
        console.log("Coluna usuario_id adicionada!");
        }
    });
})
// Mensagem para confirmar que o banco de dados foi aberto/carregado
console.log('Banco de dados criado!')

// Exporta o banco para uso externo
module.exports = db;