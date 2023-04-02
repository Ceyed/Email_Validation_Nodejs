const { Client } = require('pg')
const { DB_DATABASE, DB_USERNAME, DB_PASSWORD, TABLE_NAME, DB_PORT } = require('./config')

// * Define create table query
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR(50) NOT NULL,
        "code" VARCHAR(8) NOT NULL,
        "activated" BOOL DEFAULT '0',
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`

async function saveCodeToDB(userEmail) {
    // * Create client object
    const client = new Client({
        host: "localhost",
        user: DB_USERNAME,
        port: DB_PORT,
        password: DB_PASSWORD,
        database: DB_DATABASE
    })

    // * Create connection to database
    try {
        await client.connect()
    }
    catch (error) {
        console.error(error.stack)
        await client.end()
        return false
    }

    // * Create table every time just incase
    await client.query(createTableQuery)

    // * Create random number to save in database
    const randomNumber = (Math.floor(Math.random() * 100000000) + 100000000).toString().substring(1)

    // * Check if email already exists
    const checkIfEmailExistsQuery = `SELECT COUNT(*) FROM ${TABLE_NAME} WHERE email = '${userEmail}';`
    const existenceResponse = await client.query(checkIfEmailExistsQuery)
    if (existenceResponse.rows[0].count == 0) {
        // * Not founded | Insert new row in database
        console.log("Not founded | Insert new row in database");
        const insertToDBQuery = `INSERT INTO ${TABLE_NAME} ("email", "code") VALUES ('${userEmail}', '${randomNumber}')`
        await client.query(insertToDBQuery)
    }
    else {
        // * Founded | Update row
        console.log("Founded | Update row");
        const updateRowDBQuery = `UPDATE ${TABLE_NAME} SET code = '${randomNumber}' WHERE email = '${userEmail}';`
        await client.query(updateRowDBQuery)
    }

    // * Close connection to database and return random number
    await client.end()
    return randomNumber
}


async function giveMeVerifyCode(userEmail) {
    // * Create client object
    const client = new Client({
        host: "localhost",
        user: DB_USERNAME,
        port: DB_PORT,
        password: DB_PASSWORD,
        database: DB_DATABASE
    })

    // * Create connection to database
    try {
        await client.connect()
    }
    catch (error) {
        console.error(error.stack)
        await client.end()
        return false
    }

    // * Create table every time just incase
    await client.query(createTableQuery)

    const getVerifyCodeQuery = `SELECT code FROM ${TABLE_NAME} WHERE email = ${userEmail};`
    const verifyCodeResponse = await client.query(getVerifyCodeQuery)
    var verifyCode = null
    if (verifyCodeResponse.rowCount == 0) {
        // * Not found email
        verifyCode = null
    }
    else {
        // * Email founded
        verifyCode = verifyCodeResponse.rows[0].code
    }

    // * Close connection to database and return verify code
    await client.end()
    return verifyCode
}


async function activateEmail(userEmail) {
    // * Create client object
    const client = new Client({
        host: "localhost",
        user: DB_USERNAME,
        port: DB_PORT,
        password: DB_PASSWORD,
        database: DB_DATABASE
    })

    // * Create connection to database
    try {
        await client.connect()
    }
    catch (error) {
        console.error(error.stack)
        await client.end()
        return false
    }

    // * Create table every time just incase
    await client.query(createTableQuery)

    // * Active email
    var activated = null
    try {
        const getVerifyCodeQuery = `UPDATE ${TABLE_NAME} SET activated = '1' WHERE email = ${userEmail};`
        await client.query(getVerifyCodeQuery)
        activated = true
    }
    catch {
        activated = false
    }

    // * Close connection to database and return verify code
    await client.end()
    return activated
}


module.exports = {
    saveCodeToDB,
    giveMeVerifyCode,
    activateEmail,
}
