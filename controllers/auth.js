const User = require('../models/user')
const {Op} = require('sequelize')
const {validationResult} = require('express-validator')


const bcrypt = require('bcryptjs')
const nodemailer  = require('nodemailer')
const crypto = require('crypto')
const { use } = require('../Routes/auth')

const transporter = nodemailer.createTransport({
    host : "sandbox.smtp.mailtrap.io",
    port : 2525,
    auth : {
        user :"8601bda91dcf9e",
        pass :"880b5846cf7676"
    }
})

exports.getLogin = (req,res) => {
    const message = req.flash('error')[0]
    res.render('auth/login',{
        doctype:"login",
        path:"/login",
        errorMessage: message,
        oldInput : {},
        validationError : {}
        })
}
exports.postlogin = (req,res,next) => {
    const email = req.body.email
    const password = req.body.password
    const errors  = validationResult(req)
 if (!errors.isEmpty()) {
 return   res.status(422).render('auth/login',{
        doctype:"login",
        path:"/login",
        errorMessage: errors.array()[0].msg,
        oldInput : {
            email,
            password
        },
        validationError : errors.mapped()
        })
}
    User.findOne({where:{email : email}})
    .then(async user => {
        if (!user) {
            // req.flash('error','Invalid Email or Password')
            return req.session.save(() => {    
                return res.render('auth/login',{
                    doctype:"login",
                    path:"/login",
                    errorMessage: 'Invalid Email or Password',
                    oldInput : {
                        email,
                        password
                    },
                    validationError : {}
                    })
            });
        }
    const comparison = await bcrypt.compare(password,user.password)
    if (comparison) {
        req.session.isLogged = true
        req.session.user = user
        // res.cookie('isLogged','true')
        req.session.save(() => {
             res.redirect('/')
        })
    }
    else {
        // req.flash('error','Invalid Email or Password')
        req.session.save(() => {
            res.render('auth/login',{
                doctype:"login",
                path:"/login",
                errorMessage: 'Invalid Email or Password',
                oldInput : {
                    email,
                    password
                },
                validationError : {}
                })
        })
    }
    })
    .catch(err => next(err))
}

exports.getSignup = (req,res) => {
    const message = req.flash('error')[0]
    res.render('auth/signup', {
        doctype : 'Signup',
        path : '/signup',
        errorMessage : message,
        oldInput : {},
        validationError : {}
            })
}

exports.postSignup = (req,res,next) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
            doctype : 'Signup',
            path : '/signup',
            errorMessage : errors.array()[0].msg,
            oldInput : {
                email,
                password,
                confirmPassword
            },
            validationError : errors.mapped()
                })
    }
    User.findOne({where:{email : email}})
    .then( (user) => {
        if (user) {
            req.flash('error','E-Mail already exists')
            const message = req.flash('error')[0]
            req.session.save(()=> {
                res.render('auth/signup', {
                    doctype : 'Signup',
                    path : '/signup',
                    errorMessage : message,
                    oldInput : {
                        email,
                        password,
                        confirmPassword
                    },
                    validationError : {email : true}
                        })
            })
        }
        else {
            const hashing =async () => {
                const hashedPassword = await bcrypt.hash(password,12)
                const newUser = await User.create({
                    email : email,
                    password : hashedPassword
                })
                const cart = await newUser.getCart()
                if (!cart) {
                    newUser.createCart()
                }
                res.redirect('/login')
                transporter.sendMail({
                    to : email,
                    from : 'koko@lolo.com',
                    subject : 'sended email successfully',
                    html : '<h1> Good Job </h1>'
                })
            }
            hashing()
        }
    })
    .catch(err => next(err))
}




exports.postlogout = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}


exports.getReset = (req,res) => {
    const message = req.flash('error')[0]
    res.render('auth/reset',{
        doctype : 'Resetting Password',
        path : '/reset',
        errorMessage : message
    })
}


exports.postReset = (req,res,next) => {
    crypto.randomBytes(32,(err,buffer) => {
        if (err) {
            console.log(err)
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        const email = req.body.email
        User.findOne({where : {email : email}})
        .then((user) => {
            if (!user) {
                req.flash('error','No account with that email found')
             return req.session.save(() => {
                     res.redirect('/reset')
                })
            }
            user.resetToken = token
            user.resetTokenExpiration = Date.now() + 3600000
            user.save()
        })
        .then(()=> {
            res.redirect('/')
            transporter.sendMail({
                to : email,
                from : 'koko@lolo.com',
                subject : 'Reset a password',
                html : `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:5000/reset/${token}">link</a>  to set a new password</p>
                `
            })
        })
        .catch(err => next(err))
    })
}


exports.getUpdatingPassword = (req,res,next) => {
    const message = req.flash('error')[0]
    const token  = req.params.resetToken
    User.findOne({where : {resetToken : token ,
        resetTokenExpiration : {[Op.gt] : Date.now()}}})
    .then(user => {
        if (!user) {
            req.flash('error',
            'Oops! That reset password link has already been used. If you still need to reset your password, submit a new request.')
        return req.session.save(()=> {
                res.redirect(`/reset`)
            })
        }
        res.render('auth/new password',{
            doctype : 'New Passowrd',
            path : '/new password',
            id : user.id,
            resetToken : token,
            errorMessage : message
        })
    })
    .catch(err => next(err))
}

exports.postUpdatingPassword = (req,res,next) => {
    const password = req.body.password
    const id = req.body.userID
    const token = req.body.token
    const errors  = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/new password',{
                doctype : 'New Passowrd',
                path : '/new password',
                id : id,
                resetToken : token,
                errorMessage : errors.array()[0].msg
            })
        }
    User.findOne({where:{id:id,
        resetToken : token,
        resetTokenExpiration : {[Op.gt] : Date.now()}
    }})
    .then(async user => {
      const hashedPassword = await bcrypt.hash(password,12)
        user.password = hashedPassword
        user.resetToken = null
        user.resetTokenExpiration = null
        user.save()
        console.log(user.resetTokenExpiration)
    })
    .then(() => {
        res.redirect('/login')
    })
    .catch(err => next(err))
}