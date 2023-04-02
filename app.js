var express = require('express')
var app = express()

const { saveCodeToDB, giveMeVerifyCode, activateEmail } = require('./db')
const { sendEmail } = require('./send_email')
const { emailRegexValidation } = require("./emailRegexValidation")


// sample_url = "http://localhost:3000/send?email=saeed.sarmad.976@gmail.com"


app.get('/send', async function (req) {
    // * Read user email address & generate verify code to save it with email address in database
    userEmail = req.query.email
    if (emailRegexValidation(userEmail) == false) {
        console.log("Invalid email");
        return false;
    }

    randomNumber = await saveCodeToDB(userEmail)

    // * Creating verify link to email it
    host = req.get('host')
    link = "http://" + req.get('host') + "/verify?email='" + userEmail + "'&verify_code=" + randomNumber

    // * Email verify link to user
    sendEmail(userEmail, link)
        .then((result) => console.log('Email sent...', result))
        .catch((error) => console.log(error.message))

})


app.get('/verify', async function (req, res) {
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email")

        // * Read email and verify code from url
        userEmail = req.query.email
        verifyCode = req.query.verify_code.toString()
        // console.log(`Got email: ${userEmail}`)
        // console.log(`Got code: ${verifyCode}`)

        // * Read saved verify code in database
        savedVerifyCode = await giveMeVerifyCode(userEmail)
        if (savedVerifyCode == null) {
            console.log("Email not founded");
        }
        else {
            // * Check saved verify code to given verify code
            if (savedVerifyCode == verifyCode) {
                // * Activate email
                if (await activateEmail(userEmail) == true) {
                    console.log(`Email ${userEmail} verified`)
                }
                else {
                    console.log("Something went wrong, email not activated");
                }
            }
            else {
                console.log("Verify code is not valid")
            }
        }
    }
})


app.listen(3000, function () {
    console.log("Server Is Online")
})