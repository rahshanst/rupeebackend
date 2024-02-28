const sql = require('mssql');
const dbConfig = require('./dbConfig');

async function connectDB() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Connected to the database!');
        return pool;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}
module.exports = {
    connectDB,
};

