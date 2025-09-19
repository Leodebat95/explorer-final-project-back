/* migrations --- forma de se exportar dados em JS pro SQL
                  assim, se automatiza o processo de criação/recriação de tabelas SQL pelo JS */

const createUsers = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR,
    email VARCHAR,
    password VARCHAR,
    user_type VARCHAR DEFAULT 'regular',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;


module.exports = createUsers;
