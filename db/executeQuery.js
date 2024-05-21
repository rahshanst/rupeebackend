const sql = require('mssql');
const config = require('./dbConfig');
const logger = require("../utils/logger");

async function executeQuery(query, parameters = []) {
    try {
        const pool = await sql.connect( );
        const request = pool.request();

        // Add parameters to the request
        parameters.forEach(param => {
            request.input(param.name, param.type, param.value);
        });
        logger.info(`Executing query ${query}`);
        const result = await pool.request().query(query);
        return result;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to be caught by the calling function
    }
}

module.exports = {
    executeQuery
};
