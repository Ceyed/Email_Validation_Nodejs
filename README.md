# Email Authorization Service
An email authorization program using NodeJs - Generate random number and email it to user's email for validation


## TODO:
- [x] 01. Regex for each input parameters
- [x] 02. User a better structure in files
- [x] 03. More clear app.js
- [x] 04. Use 'dotenv' instead of 'config'
- [x] 05. 'Send' function should be post method
- [x] 06. Can 'Verify' function use post method? - Answer: No!
- [x] 07. Replace 'verify' with 'validate'
- [ ] 08. A new file for 'connection' to db, another for rest of the interacts
- [ ] 09. Login request, Gets 'username' and 'password', Returns Token or false
- [ ] 10. Sign-up request, Gets 'username', 'password' and 'email' -> Saves them immediately in db -> Send validation code to user -> return token (jwt)
- [ ] 11. Validation request (POST), get 'token', 'validation code' and validate user -> remove the row in 'validate' table
- [ ] 12. ChangePassword request, gets 'token', 'old password' and 'new password'
