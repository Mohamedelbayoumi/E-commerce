const express = require('express')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
// const csrf = require('tiny-csrf')
const {csrfSync} = require('csrf-sync')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const {v4 : uuidv4 } = require('uuid')
const crypto = require('crypto')
const path  = require('path')
const adminroutes = require('./Routes/admin')
const shoproutes = require('./Routes/shop')
const pageNotFound = require('./controllers/404')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const cartItem = require('./models/cart item')
const Order = require('./models/order')
const orderItem  = require('./models/order item')
const authroutes  = require('./Routes/auth')

const app = express()
const {csrfSynchronisedProtection} = csrfSync()

const fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/png'
     || file.mimetype === 'image/jpg'
     || file.mimetype === 'image/jpeg') 
     {
        cb(null,true)
     }
     else {
        cb(null,false)
     }
}
const fileStorage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'images')
    },
    filename : (req,file,cb) => {
        cb (null, new Date().toISOString().replace(/:/g,'-') + '-' + file.originalname)
        // cb (null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname)
        // cb (null,uuidv4() + '-' + file.originalname)
    }
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// app.engine('hbs',engine({defaultLayout:'main layout',extname:'hbs'}))
app.set('views','./views')
app.set('view engine','ejs')

const sessionStore  = new MySQLStore({
    host:'localhost',
    port:3000,
    user:'root',
    password:'mentafi',
    database:'node-complete'
})

  // app.use(cookieParser("cookie-parser-secret"));

app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized:false,
    store:sessionStore
}))

app.use(flash())

app.use(multer({storage : fileStorage,fileFilter : fileFilter}).single('image'))

// app.use(csrf("123456789iamasecret987654321look"))
app.use(csrfSynchronisedProtection)


app.use((req, res, next) => {
    res.locals.isAuthenicated = req.session.isLogged;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  app.use(express.static(path.join(__dirname ,'public')))
  app.use('/images',express.static(path.join(__dirname,'images')))

app.use((req,res,next) =>{
    if (!req.session.user) {
        return next()
    }
    User.findByPk(req.session.user.id)
    .then(user =>{
        if (!user) {
            return next()
        }
        req.user = user
        next()
    })
    .catch(err => {
        next(err)
    })
})


app.use('/admin',adminroutes.router)
app.use(shoproutes)
app.use(authroutes)

app.get('/500',pageNotFound.show500)
app.use(pageNotFound.notFound)


app.use((error,req,res,next) =>{
    console.log(error)
    res.status(500).render('500',{
        doctype : 'Server is down',
        path : ''
    })
})



// const url = express.urlencoded({extended:true})

global.rootdir= __dirname

User.hasMany(Product,{constraints:true,onDelete:"CASCADE"})
Product.belongsTo(User)

User.hasOne(Cart)
Cart.belongsTo(User)

Cart.belongsToMany(Product,{through:cartItem})
Product.belongsToMany(Cart,{through:cartItem})

Order.belongsTo(User)
User.hasMany(Order)

Order.belongsToMany(Product,{through:orderItem})
Product.belongsToMany(Order,{through:orderItem})

// sequelize.sync({force:true})
// sequelize.sync() >>> create table and if it exists will do nothing
sequelize
.sync()
.then(cart => {
    app.listen(5000)
})
.catch(err => console.log(err))
