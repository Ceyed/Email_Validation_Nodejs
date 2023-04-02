const { giveMeValidationCode, validateEmail } = require('../model/db')


async function validateCode(userEmail, inputValidationCode) {
    try {
        // * Read saved validation code in database
        const savedValidationCode = await giveMeValidationCode(userEmail)
        if (savedValidationCode == null) {
            // * Email not founded
            // response.send('Email not founded')
            return
        }
        else {
            // * Check saved validation code to given validation code
            if (savedValidationCode == inputValidationCode) {
                // * Activate email
                if (await validateEmail(userEmail) == true) {
                    console.log(`The email ${userEmail} has got validate`)
                }
                else {
                    console.log("Something went wrong, email didn't validate");
                }
            }
            else {
                console.log("Validation code is not valid")
            }
        }
    }
    catch {
        response.send('Error 11: Unexpected error accrued. Please contact admin')
        return false
    }
}

module.exports = {
    validateCode,
}
