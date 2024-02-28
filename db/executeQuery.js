const sql = require('mssql');
const config = require('./dbConfig');

async function executeQuery(query, parameters = []) {
    try {
        const pool = await sql.connect( );
        const request = pool.request();

        console.log({query})
        // Add parameters to the request
        parameters.forEach(param => {
            request.input(param.name, param.type, param.value);
        });

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
