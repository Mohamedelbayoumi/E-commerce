const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const Product = require('../models/product')
const Cart = require('../models/cart')
const Order = require('../models/order')
const { where } = require('sequelize')

exports.showProducts = (req,res,next) => {
Product.findAll()
.then((products) => {
    res.render('shop/product list',{
        prods : products ,
        doctype :'All Products',
        path:'/products',
        shopActive:true,
        shopCSS:true
    })
})
.catch(err => next(err))
}

exports.findProductByID = (req,res,next) => {
    const prodID = req.params['productID']
    console.log(req.params)
    console.log(prodID)
     Product.findByPk(prodID)
    .then((data) => {
        console.log(data,11111)
        res.render('shop/product details',{
            product:data,
            doctype:data.title,
            path:'products'
        })
        return
    })
    .catch(err => next(err))
}


exports.index = (req,res,next) => {
 Product.findAll()
 .then((products) => {
    res.render('shop/index',{
        prods : products ,
        doctype :'shop',
        path:'/',
        shopActive:true,
        shopCSS:true
    })
 })
 .catch(err => next(err))
}


exports.getcart = (req,res,next) => {
  req.user.getCart()
  .then((cart) => {
   return cart.getProducts()
  })
  .then((cartProducts) => {
    res.render('shop/cart',{
            doctype:"Cart",
            path:'/cart',
            products:cartProducts
        }) 
    })
  .catch(err => next(err))
  
}


exports.postcart = (req,res,next) => {
    const prodID = req.params.productId
    let fetchedCart;
    let newquantity =1
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart
     return cart.getProducts({where:{id : prodID}})
    })
    .then(products => {
        let product 
        if (products.length > 0) {
            product = products[0]
        }
        if (product) {
            newquantity = product.cartItem.quantity
            newquantity++
        }
        return Product.findByPk(prodID)
        .then(product => {
        return fetchedCart.addProduct(product,{through:{quantity:newquantity}})
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => next(err))
    })
    .catch(err =>next(err))
}

exports.getOrders = (req,res,next) => {
    req.user.getOrders({include:{model : Product}})
    .then((orders) => {
        res.render('shop/orders',{
            doctype:"Your Orders",
            path:'/orders',
            orders : orders
        })
    })
    .catch(err => next(err))
}

exports.postOrders = (req,res,next) => {
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart
     return cart.getProducts()
    })
    .then(products => {
       return req.user.createOrder()
        .then(order => {
         return   order.addProducts(
                products.map(product => {
                product.orderItem = {quantity : product.cartItem.quantity}
                return product
                }))
        })
    })
    .then(() => {
        fetchedCart.setProducts(null)
    })
    .then(() => {
        res.redirect('/orders')
    })
    .catch(err => next(err))
}


exports.postDeleteCartProduct = (req,res,next) => {
    const id = req.body.id
    req.user.getCart()
    .then(cart => {
     return cart.getProducts()
    })
    .then(products => {
        const product = products[0]
       return product.cartItem.destroy()
    })
    .then(() => {
        res.redirect('/cart')
    })
    .catch(err => next(err))
}

exports.getInvoice = (req,res,next) => {
    const orderID = req.params.orderID
    const invoiceName = 'invoice-' + orderID + '.pdf'
    const invoicePath = path.join('data', 'invoices',invoiceName )
    Order.findByPk(orderID,{include : 'products'})
    .then((order) => {
        if (order.userId === req.user.id) {
            const doc = new PDFDocument()
            doc.pipe(fs.createWriteStream(invoicePath))
            res.setHeader('Content-Type','application/pdf')
            res.setHeader('Content-Disposition',`attachment; filename = ${invoiceName}`)
            doc.pipe(res)
            doc.fontSize(28).text('Invoice')
            doc.text('---------------')
            let totalPrice =0
            order.products.forEach(prod => {
                doc.fontSize(20).text(`${prod.title} - ${prod.orderItem.quantity} x $${prod.price}`)
                totalPrice += prod.orderItem.quantity * prod.price
            });
            doc.text('---------------')
            doc.fontSize(24).text(totalPrice)
            doc.end()

        }
        else {
            next(new Error())
        }
    })
    .catch(err => next(err))
}
    // fs.readFile(invoicePath,(err,data) => {
    //     if (err) {
    //         return next(err)
    //     }
    //     res.setHeader("Content-Type","text/plain")
    //     res.setHeader("Content-Disposition",`attachment; filename = ${invoiceName} `)
    //     res.send(data)
    // })

    // res.setHeader('Content-Type','text/plain')
    // res.setHeader('Content-Disposition',`attachment; filename = ${invoiceName}`)
    // res.sendFile( path.join(__dirname,"../" ,invoicePath))
    // res.sendFile(invoiceName,{root : invoicePath})

    // fe el options momken t7ot el relative path bas fi haltna di
    // hatms7 essm el invoice name men el invoice path
    
    // res.download(invoicePath)


/*
3andek 3 tor2 enak t3mel download lel client : 
1.fs.readfile: hayrg3 buffer trg3ha lel cleint we tzebet el header tab3en
2.res.sendFile: t7ot absolute path lel file we tzebet el header tab3en
3.res.download: t7ot relative path wi bas (this method uses res.sendFile())
fs.read fiha callback bas res.send mafihash
ama el 2 el taneen fihom callback function 3ashan tehandel el err
*/

// absolute path >> t7ot fiha el dir name
// relative path >> mt7otsh fiha el dir name 3ashan bybd2 men el root folder 
// wi btste5dmhom 3la haseb el function 3ayza anhi wahda
// __dirname >> el folder elly enta mawgood fih 


