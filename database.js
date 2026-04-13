
const Database = require('better-sqlite3');
const db = new Database('test.db');

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

// Executar SQL
db.exec(createTableSQL);

console.log('✅ Tabela produtos criada!');