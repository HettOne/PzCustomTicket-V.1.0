const { Pool } = require('pg');

// Configuração do pool de conexões
const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_a5LBzbkT1Ylf@ep-super-sunset-a5yx1vbl-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
    // Conectando com configurações extras (exemplo: timeout)
    connectionTimeoutMillis: 10000,  // Timeout de conexão em ms
    idleTimeoutMillis: 30000,        // Tempo de espera para conexão ociosa em ms
    max: 20,                         // Número máximo de conexões no pool
});

// Função para buscar tickets por usuário e status
async function getTicketByUserAndStatus(userId, status) {
    const query = 'SELECT * FROM tickets WHERE user_id = $1 AND status = $2';
    return await queryDatabase(query, [userId, status]);
}


// Função para executar consultas utilizando o pool
async function queryDatabase(query, values) {
    const client = await pool.connect();  // Obtém uma conexão do pool
    try {
        const res = await client.query(query, values); // Executa a consulta
        return res.rows; // Retorna os resultados da consulta
    } catch (err) {
        console.error('Erro ao executar consulta no banco de dados:', err);
        throw err; // Lança o erro para ser tratado no ponto de chamada
    } finally {
        client.release();  // Libera a conexão de volta para o pool
    }
}

// Função para buscar tickets por usuário
async function getTicketByUser(userId) {
    const query = 'SELECT * FROM tickets WHERE user_id = $1';
    return await queryDatabase(query, [userId]);
}

// Função para criar um novo ticket no banco de dados
async function createTicket(ticketData) {
    const query = `
        INSERT INTO tickets (user_id, ticket_id, categoria, status, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [ticketData.userId, ticketData.ticketId, ticketData.categoria, ticketData.status, ticketData.createdAt];
    return await queryDatabase(query, values);
}

// Função para atualizar o status de um ticket
async function updateTicketStatus(ticketId, status) {
    const query = 'UPDATE tickets SET status = $1 WHERE ticket_id = $2 RETURNING *';
    const values = [status, ticketId];
    return await queryDatabase(query, values);
}

// Função para excluir um ticket com base no ticket_id
async function deleteTicketByTicketId(ticketId) {
    const query = 'DELETE FROM tickets WHERE ticket_id = $1';
    await queryDatabase(query, [ticketId]);
}

async function createTicketTranscription(ticketId, transcriptionContent) {
    const query = `
        INSERT INTO ticket_transcriptions (ticket_id, content, created_at)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [ticketId, transcriptionContent, new Date()];
    return await queryDatabase(query, values);
}


// Função para buscar o ticket com base no ticket_id
async function getTicketByChannelId(channelId) {
    const query = 'SELECT * FROM tickets WHERE ticket_id = $1';
    const values = [channelId];
    const result = await queryDatabase(query, values);
    return result.length > 0 ? result[0] : null;
}

// Função para buscar todos os tickets
async function getAllTickets() {
    const query = 'SELECT * FROM tickets';
    return await queryDatabase(query, []);
}

// Verificando se a conexão está funcionando corretamente
async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');  // Consulta simples para testar a conexão
        console.log('Banco de dados conectado:', res.rows[0]);
    } catch (err) {
        console.error('Erro ao testar conexão:', err);
    }
}

// Chamando a função de teste de conexão
testConnection();

// Tratamento de erros de conexão do pool
pool.on('error', (err, client) => {
    console.error('Erro na conexão com o banco de dados', err);
    // Aqui você pode tentar reconfigurar o pool ou reiniciar o cliente
});

module.exports = {
    getTicketByUser,
    createTicket,
    updateTicketStatus,
    deleteTicketByTicketId,
    getTicketByChannelId,
    getAllTickets,
    createTicketTranscription,
    getTicketByUserAndStatus,  // Adicionando a nova função exportada
};

