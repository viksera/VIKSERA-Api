const { Client } = require('pg');

class Psql {

    client = new Client({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,   
        database: process.env.POSTGRES_DB, 
        password: process.env.POSTGRES_PASSWORD, 
        port: process.env.POSTGRES_PORT,                   
    });

    /**
     * Create psql client connection to the DB
     */
    async  #connectToDatabase() {
        try {
            await this.client.connect();
            console.log('Connected to PSQL database');
        } catch (error) {
            console.error('Database connection error:', error);
            throw new Error(error)
        }
    };

    /**
     * close the client connection to PSQL DB
     */
    async #closeConnection() {
        try {
            await this.client.end();
            console.log('Disconnected from PostgreSQL database');
        } catch (err) {
            console.log("Errow while disconnecting psql client");
        }

    };

    /**
     * Function insert a row into the provided table
     * @param {string} tableName    Table to be inserted Eg: users
     * @param {object} data     row data to be inserted Eg: {userid:1}     
     * @returns returns the inserted row data 
     */
    async insertRow(tableName, data) {

        // Generate column names and values from the data object
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *;`;
        console.log("Logging the query and values", query, values);
        try {
            await this.#connectToDatabase();
            const res = await this.client.query(query, values);
            console.log('Insert successful:', res.rows[0]);
            return res.rows[0]; 
        } catch (error) {
            console.error('Error inserting data: ', tableName, data, error);
            throw new Error(`Failed to insert data into ${tableName}`); 
        } finally {
            await this.#closeConnection();
        }

    };

    /**
     * This function reads the records from the table based on the condition
     * @param {string} tableName    Table name in string Eg: userid
     * @param {string} condition    condition in string format Eg: where userid=$1 
     * @param {Array} params        Array params for the conditions Eg: [1,2]
     * @returns the rows that matches the condition
     */
    async readData(tableName, condition = '', params = []) {

        const query = `SELECT * FROM ${tableName} ${condition};`;
        console.log("Logging the query and values", query, params);
        try {
            await this.#connectToDatabase();
            const res = await this.client.query(query, params);
            return res.rows;
        } catch (error) {
            console.error('Error reading data:',tableName, condition, params, error);
            throw new Error(`Failed to read data from ${tableName}`); 
        } finally {
            await this.#closeConnection();
        }
    };

    /**
     * Function updates the record with the provided value and condition
     * @param {string} tableName    Table name in string Eg: userid
     * @param {object} data     Data to be updated in JSON format Eg: {key1:1,key2:2}
     * @param {string} condition    where condition in string format Eg: user=$1 and mark>1
     * @param {Array} params    Array of params for the where condition Eg: [1,2]    
     * @returns the updated rows
     */
    async updateData(tableName, data, condition , params = []) {

        const setClause = Object.keys(data)
            .map((key, index) => `${key} = $${params.length + index + 1 }`)
            .join(', ');

        const query = `UPDATE ${tableName} SET ${setClause} WHERE ${condition} RETURNING *;`;
        const values = [...params, ...Object.values(data)];
        console.log("Logging the query and values", query, values);
        try {
            await this.#connectToDatabase();
            const res = await this.client.query(query, values);
            return res.rows;
        } catch (error) {
            console.error('Error updating data:', tableName, data, condition, error);
            throw new Error(`Failed to update data in ${tableName}`); 
        } finally {
            await this.#closeConnection();
        }
    };

    /**
     * Delete the rows from the table using the where condition
     * @param {string} tableName    Table name in string Eg: userid
     * @param {string} condition    Where condition for the delete operation Eg: userid=$1
     * @param {Array} params    Array params for the where condition Eg: [1,2]
     * @returns The deleted rows
     */
    async deleteData(tableName, condition, params) {

        const query = `DELETE FROM ${tableName} WHERE ${condition} RETURNING *;`;
        console.log("Logging the query and values", query, params);
        try {
            await this.#connectToDatabase();
            const res = await this.client.query(query, params);
            return res.rows;
        } catch (error) {
            console.error('Error deleting data:', tableName, condition, params, error);
            throw new Error(`Failed to delete data from ${tableName}`); 
        } finally {
            await this.#closeConnection();
        }
    };

    /**
     * This method performs the query recieved directly
     * can be used when performing complex queries for analytics
     * @param {string} query  
     * @param {Array} params 
     * @returns the computed result rows of the query 
     */
    async executeQuery(query, params = []) {
        try {
            await this.#connectToDatabase();
            const res = await this.client.query(query, params);
            console.log("Query executed in the DB result", res.rows);
            return res.rows;
        } catch (error) {
            console.error('Error executing the query ', tableName, condition, params, error);
            throw new Error(`Failed to execut the query ${tableName}`); 
        } finally {
            await this.#closeConnection();
        }
    }
}

module.exports = Psql;
