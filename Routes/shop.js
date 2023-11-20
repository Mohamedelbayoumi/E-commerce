const express = require('express')
const router = express.Router()

const product = require('../controllers/products')
const isAuth = require('../middleware/is auth')

router.get('/products',product.showProducts)

router.get('/product/:productID',product.findProductByID)

router.get('/cart',isAuth,product.getcart)

router.post('/cart/:productId',isAuth,product.postcart)

router.get('/orders',isAuth,product.getOrders)

router.post('/orders',isAuth,product.postOrders)

router.get('/',product.index)

router.post('/cart-delete-product',isAuth,product.postDeleteCartProduct)

router.get('/orders/:orderID', isAuth,product.getInvoice)

module.exports = router