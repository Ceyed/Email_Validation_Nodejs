var express = require('express')
var app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const { sendCode } = require('./controller/sendCode')
const { validateCode } = require('./controller/validateCode')
const { emailRegexValidation, codeRegexValidation } = require("./controller/regexValidation.js")


app.post('/send', async (request, response) => {
    try {
        const { userEmail } = request.body

        // * Regex validation
        if (await emailRegexValidation(userEmail) == false) {
            // * Invalid email
            response.send('Error: Can not send email. Make sure your email address is valid');
            return false
        }

        const sendCodeResponse = await sendCode(request, userEmail)

        if (sendCodeResponse == true) {
            response.send('Email sent');
        }
        else if (sendCodeResponse == false) {
            response.send('Error: Can not send email. Make sure your email address is valid');
        }
        else if (sendCodeResponse == "activated") {
            response.send('Email already activated');
        }
        else {
            response.send('Error 12: Unexpected error accrued. Please contact admin')
        }
    }
    catch (error) {
        response.send('Error 8: Unexpected error accrued. Please contact admin')
        // console.log(error);
        return
    }
})


app.get('/validate', async function (request, response) {
    try {
        // * Read email and validate code from url
        const userEmail = request.query.email
        const inputValidateCode = request.query.validation_code.toString()

        // // * Regex validation
        // if (await emailRegexValidation(userEmail) == false || await codeRegexValidation(inputValidateCode) == false) {
        //     // * Invalid email
        //     response.send('Error: Can not validate email. Click on the validation link again');
        //     return false
        // }

        validateCode(userEmail, inputValidateCode)
    }
    catch {
        response.send('error 9: Unexpected error accrued. Please contact admin')
        return
    }
})


app.listen(3000, function () {
    console.log("Server Is Online")
})