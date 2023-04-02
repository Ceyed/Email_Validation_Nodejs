// ! File should be renamed to: config.js

// * Gmail Configs
const CLIENT_ID = 'GMAIL_CLIENT_ID';
const CLIENT_SECRET = 'GMAIL_CLIENT_SECRET';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = 'GMAIL_REFRESH_TOKEN';


// * Database
const DB_DATABASE = "email_validation"
const DB_USERNAME = "ev_user"
const DB_PASSWORD = "ev_password"
const TABLE_NAME = "validate"
const DB_PORT = 5432

module.exports = {
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
    REFRESH_TOKEN,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    TABLE_NAME,
    DB_PORT,
}
