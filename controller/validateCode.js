const { giveMeValidationCode, validateEmail } = require('../model/db')


async function validateCode(userEmail, inputValidationCode) {
    try {
        // * Read saved validation code in database
        const savedValidationCode = await giveMeValidationCode(userEmail)
        if (savedValidationCode == null) {
            // * Email not founded
            return false
        }
        else {
            // * Check saved validation code to given validation code
            if (savedValidationCode == inputValidationCode) {
                // * Activate email
                if (await validateEmail(userEmail) == true) {
                    // * The email has got validate
                    return true
                }
                else {
                    // * Something went wrong, email didn't validate
                    return false
                }
            }
            else {
                // * Validation code is not valid
                return false
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
