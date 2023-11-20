const {check,body} = require('express-validator')

exports.checkEmail = () => {
    // normalizeEmail() >> convert uppercase into lowercase
 return   check('email').normalizeEmail().isEmail()
 .withMessage('please enter a valid email address')
    // .custom((input,{req}) => {
    //     if (input === 'toto@koko.com') {
    //          throw new Error('this email is forbidden')
    //     }
    //     return true
    // })
}
exports.checkPassword = () => {
return  body('password',
  'please enter a password with numbers and text only and at least 5 characters')
  .trim().isLength({min : 5}).isAlphanumeric()
}

exports.checkConfirmPassword = () => {
    return body('confirmPassword').trim()
    .custom((input,{req}) => {
        if (input !== req.body.password) {
            throw new Error('Passwords must match')
        }
        else if (!input) {
            throw new Error('please enter a password with numbers and text only and at least 5 characters')
        }
        return true
    })
}
