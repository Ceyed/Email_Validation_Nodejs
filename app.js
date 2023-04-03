var express = require('express')
var app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const { sendCode } = require('./controller/sendCode')
const { validateCode } = require('./controller/validateCode')


app.post('/send', async (request, response) => {
    try {
        const { userEmail } = request.body
        await sendCode(request, response, userEmail)
    }
    catch (error) {
        response.send('Error 8: Unexpected error accrued. Please contact admin')
        return
    }
})


app.get('/validate', async function (request, response) {
    try {
        await validateCode(request, response)
    }
    catch (error) {
        response.send('error 9: Unexpected error accrued. Please contact admin')
        return
    }
})


app.listen(process.env.PORT, function () {
    console.log(`Server Is Online::${process.env.PORT}`)
})
