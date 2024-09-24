const { Client } = require('pg');

// Create a PostgreSQL client
const client = new Client({
    user: 'your_username',         // user name
    host: 'localhost',             // database host address
    database: 'your_database',     // database name
    password: 'your_password',     // database password
    port: 5432,                    // PostgreSQL port
});

// Connect to the PostgreSQL database
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

// Function to close the database connection
async function closeConnection() {
    await client.end();
    console.log('Disconnected from PostgreSQL database');
};

// Function to insert data into a table
async function insertData(tableName, data) {
    // Generate column names and values from the data object
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *;`;
    
    try {
        const res = await client.query(query, values);
        console.log('Insert successful:', res.rows[0]); // Output the inserted row
        return res.rows[0]; // Return the inserted row
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};

// Function to read data from a table
async function readData(tableName, condition = '', params = []) {

    const query = `SELECT * FROM ${tableName} ${condition};`;
    
    try {
        const res = await client.query(query, params);
        return res.rows;
    } catch (error) {
        console.error('Error reading data:', error);
    } finally {
        console.log('Disconnected from PostgreSQL database');
    }
};

// Function to update data in a table
async function updateData(tableName, data, condition, params) {

    const setClause = Object.keys(data)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');

    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${condition} RETURNING *;`;
    const values = [...Object.values(data), ...params];

    try {
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Error updating data:', error);
    } finally {
        console.log('Disconnected from PostgreSQL database');
    }
};

// Function to delete data from a table
async function deleteData(tableName, condition, params) {

    const query = `DELETE FROM ${tableName} WHERE ${condition} RETURNING *;`;

    try {
        const res = await client.query(query, params);
        return res.rows[0];
    } catch (error) {
        console.error('Error deleting data:', error);
    } finally {
        console.log('Disconnected from PostgreSQL database');
    }
};


module.exports = {
    insertData,
    readData,
    updateData,
    deleteData
};
