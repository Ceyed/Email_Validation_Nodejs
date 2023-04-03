const { saveCodeToDB, emailAlreadyValidated } = require('../model/db')
const { sendEmail } = require('./send_email')


async function sendCode(request, userEmail) {
    try {
        // * Check if email already validated
        if (await emailAlreadyValidated(userEmail) == true) {
            // * Already validated
            return "activated"
        }

        console.log('2 1');

        // * Creating and saving random number in database
        const randomNumber = await saveCodeToDB(userEmail)
        if (randomNumber == false) {
            return false
        }

        console.log('2 2');

        // * Creating validation link to email it
        const host = request.header('host')
        const link = "http://" + host + "/validate?email=" + userEmail + "&validation_code=" + randomNumber

        // * Email validation link to user
        var sendEmailResponse = null
        await sendEmail(userEmail, link)
            .then((result) => sendEmailResponse = true)
            .catch((error) => sendEmailResponse = false)

        console.log('2 3');

        return sendEmailResponse
    }
    catch {
        response.send('Error 10: Unexpected error accrued. Please contact admin')
        return false
    }
}


module.exports = {
    sendCode,
}
