var express = require('express')
var app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const { sendCode } = require('./controller/sendCode')
const { validateCode } = require('./controller/validateCode')
const { emailRegexValidation, codeRegexValidation } = require('./controller/regexValidation.js')


app.post('/send', async (request, response) => {
    try {
        const { userEmail } = request.body

        // * Regex validation
        const emailRegexResult = await emailRegexValidation(userEmail)
        if (emailRegexResult == false) {
            // * Invalid email
            response.send('Error: Can not send email. Make sure your email address is valid');
            return false
        }

        const sendCodeResponse = await sendCode(request, userEmail)


        if (sendCodeResponse == true) {
            response.send('Email sent')
        }
        else if (sendCodeResponse == false) {
            response.send('Error: Can not send email. Make sure your email address is valid')
        }
        else if (sendCodeResponse == 'activated') {
            response.send('Email already activated')
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

        // * Regex validation
        const emailRegexResult = await emailRegexValidation(userEmail)
        const codeRegexResult = await codeRegexValidation(inputValidateCode)
        if (emailRegexResult == false || codeRegexResult == false) {
            // * Invalid email
            response.send('Error: Can not validate email. Click on the validation link again');
            return false
        }

        const validateCodeResponse = await validateCode(userEmail, inputValidateCode)
        if (validateCodeResponse == true) {
            response.send(`The email ${userEmail} has got validate`)
        }
        else {
            response.send(`Error in email validation, Email or code is wrong`)
        }
    }
    catch (error) {
        console.log(error)
        response.send('error 9: Unexpected error accrued. Please contact admin')
        return
    }
})


app.listen(process.env.PORT, function () {
    console.log(`Server Is Online::${process.env.PORT}`)
})
