const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = require('./config')

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendEmail(receiver, verifyCode) {
    try {
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
                type: 'OAuth2',
                user: 'SENDER_EMAIL@gmail.com',                             // TODO: Change 'SENDER_EMAIL@gmail.com'
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        })

        const mailOptions = {
            from: 'Ceyed <noreply@gmail.com>',                              // TODO: Change 'Ceyed <noreply@gmail.com>'
            to: receiver,
            subject: "Please confirm your email account",
            html: "<h3> Hello There <br> Please click on the link bellow to verify your email: <br><a href=" + verifyCode + ">Click here to verify</a><br><br> Respectfully <br> Ceyed | https://github.com/Ceyed <br></h3>"
        }

        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        return error
    }
}


module.exports = {
    sendEmail,
}
