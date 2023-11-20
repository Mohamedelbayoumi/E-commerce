const express = require("express")
const router = express.Router()

const admin = require('../controllers/admin')
const isAuth = require('../middleware/is auth')
const validator = require('../middleware/product validation')

// for /admin/add-product (get method)
router.get('/add-product',isAuth,admin.getAddProduct)


//for /admin/add-product (post method)
router.post('/add-product',
validator.checkProductName(),
validator.checkPrice(),
validator.checkDescription(),
isAuth,admin.postAddProduct)



// for /admin/products

router.get('/products',isAuth,admin.adminProducts)

  
router.use(express.urlencoded({extended:true}))



//for /admin/edit-product (get method)
router.get('/edit-product/:productID',isAuth,admin.getEditProduct)

//for /admin/edit-product (post method)
router.post('/edit-product',
validator.checkProductName(),
validator.checkPrice(),
validator.checkDescription(),
isAuth,admin.postEditProduct)

//for /admin/delete-product (post method)
router.post('/delete-product',isAuth,admin.postDeleteProduct)


exports.router = router
