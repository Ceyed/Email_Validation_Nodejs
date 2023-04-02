const { Client } = require('pg')
require('dotenv').config()


// * Define create table query
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.TABLE_NAME} (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR(50) NOT NULL,
        "code" VARCHAR(8) NOT NULL,
        "validated" BOOL DEFAULT '0',
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "modified_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`


async function emailAlreadyValidated(userEmail) {
    try {
        // * Create client object
        const client = new Client({
            host: "localhost",
            user: process.env.DB_USERNAME,
            port: process.env.DB_PORT,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })

        // * Create connection to database
        await client.connect()

        // * Create table every time just incase
        await client.query(createTableQuery)

        // * Check if email exists
        const checkIfEmailExistsQuery = `SELECT COUNT(*) FROM ${process.env.TABLE_NAME} WHERE email = '${userEmail}';`
        const existenceResponse = await client.query(checkIfEmailExistsQuery)
        if (existenceResponse.rows[0].count == 0) {
            // * Not founded
            await client.end()
            return false
        }
        else {
            // * Founded
            const emailIsValidQuery = `SELECT validated FROM ${process.env.TABLE_NAME} WHERE email = '${userEmail}';`
            const emailIsValidResponse = await client.query(emailIsValidQuery)
            await client.end()
            return emailIsValidResponse.rows[0].validated
        }
    }
    catch (error) {
        // console.error(error.stack)
        // TODO: Change lines bellow later, Please
        try {
            // * Close connection if there is any
            await client.end()
        }
        catch {

        }
        return 0
    }
}


async function saveCodeToDB(userEmail) {
    try {
        // * Create client object
        const client = new Client({
            host: "localhost",
            user: process.env.DB_USERNAME,
            port: process.env.DB_PORT,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })

        // * Create connection to database
        await client.connect()

        // * Create table every time just incase
        await client.query(createTableQuery)

        // * Create random number to save in database
        const randomNumber = (Math.floor(Math.random() * 100000000) + 100000000).toString().substring(1)

        // * Check if email already exists
        const checkIfEmailExistsQuery = `SELECT COUNT(*) FROM ${process.env.TABLE_NAME} WHERE email = '${userEmail}';`
        const existenceResponse = await client.query(checkIfEmailExistsQuery)
        if (existenceResponse.rows[0].count == 0) {
            // * Not founded | Insert new row in database
            const insertToDBQuery = `INSERT INTO ${process.env.TABLE_NAME} ("email", "code") VALUES ('${userEmail}', '${randomNumber}')`
            await client.query(insertToDBQuery)
        }
        else {
            // * Founded | Update row
            const updateRowDBQuery = `UPDATE ${process.env.TABLE_NAME} SET code = '${randomNumber}' WHERE email = '${userEmail}';`
            await client.query(updateRowDBQuery)
        }

        // * Close connection to database and return random number
        await client.end()
        return randomNumber
    }
    catch (error) {
        // console.error(error.stack)
        // TODO: Change lines bellow later, Please
        try {
            // * Close connection if there is any
            await client.end()
        }
        catch {

        }
        return 0
    }
}


async function giveMeValidationCode(userEmail) {
    try {
        // * Create client object
        const client = new Client({
            host: "localhost",
            user: process.env.DB_USERNAME,
            port: process.env.DB_PORT,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })

        // * Create connection to database
        await client.connect()

        // * Create table every time just incase
        await client.query(createTableQuery)

        // * Read saved code from database and return it
        const getValidationCodeQuery = `SELECT code FROM ${process.env.TABLE_NAME} WHERE email = '${userEmail}';`
        const validationCodeResponse = await client.query(getValidationCodeQuery)
        if (validationCodeResponse.rowCount == 0) {
            // * Not found email
            // * Close connection to database and return null
            await client.end()
            return null
        }
        else {
            // * Email founded
            // * Close connection to database and return validation code
            await client.end()
            return validationCodeResponse.rows[0].code
        }
    }
    catch (error) {
        // console.error(error.stack)
        // TODO: Change lines bellow later, Please
        try {
            // * Close connection if there is any
            await client.end()
        }
        catch {

        }
        return null
    }
}


async function validateEmail(userEmail) {
    try {
        // * Create client object
        const client = new Client({
            host: "localhost",
            user: process.env.DB_USERNAME,
            port: process.env.DB_PORT,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })

        // * Create connection to database
        await client.connect()

        // * Create table every time just incase
        await client.query(createTableQuery)

        // * Valid email
        try {
            const getValidationCodeQuery = `UPDATE ${process.env.TABLE_NAME} SET validated = '1' WHERE email = '${userEmail}';`
            await client.query(getValidationCodeQuery)
            // * Close connection to database and return validation code
            await client.end()
            return true
        }
        catch {
            // * Close connection to database and return validation code
            await client.end()
            return false
        }
    }
    catch (error) {
        // console.error(error.stack)
        // TODO: Change lines bellow later, Please
        try {
            // * Close connection if there is any
            await client.end()
        }
        catch {

        }
        return 0
    }
}


module.exports = {
    saveCodeToDB,
    giveMeValidationCode,
    validateEmail,
    emailAlreadyValidated,
}
