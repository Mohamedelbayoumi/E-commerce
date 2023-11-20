const Product = require('../models/product')
const fs= require('fs')
const {validationResult} = require('express-validator')

exports.getAddProduct = (req,res) => {
    // res.sendFile(path.join(root  ,'views' ,'add product.html'))
    res.render('admin/edit product',{
    doctype :"Add Product",
    path : '/admin/add-product',
    addProductActive:true,
    formCSS:true,
    editing:false,
    errorMessage : null,
    product : {},
    validationError : {}
})
}


exports.postAddProduct = (req,res,next) =>{

    const productName = req.body.productName
    const price = req.body.price
    const image = req.file
    const description = req.body.description
    console.log(image,111111111)
    const errors = validationResult(req)

    if (!image) {
        return res.status(422).render('admin/edit product',{
            doctype :"Add Product",
            path : '/admin/add-product',
            addProductActive:true,
            formCSS:true,
            editing:false,
            errorMessage:'No image selected',
            product : {
                title : productName,
                price,
                description
            },
            validationError : {}
        })
    }

    if (!errors.isEmpty()) {
    return  res.status(422).render('admin/edit product',{
            doctype :"Add Product",
            path : '/admin/add-product',
            addProductActive:true,
            formCSS:true,
            editing:false,
            errorMessage:errors.array()[0].msg,
            product : {
                title : productName,
                price,
                description
            },
            validationError : errors.mapped()
        })
    }
    req.user.createProduct({
        title:productName,
        price:price,
        imageURL:image.path,
        description:description
        })
    .then((result) => {
        res.redirect('/admin/products')
    }).catch((err)=>{
        // console.log(111111114)
        // console.log(err)
        // console.log(222222225)
        // throw new Error(err)
        // res.redirect('/500')
        const error = new Error(err)
        error.httpStatusCode= 500
        return  next(error)
    })

}

exports.getEditProduct = (req,res,next) => {
    const editMode = req.query.edit
    if (!editMode) {
      return  res.redirect('/')
    }
    const id = req.params.productID
    req.user.getProducts({where:{id:id}})
    // Product.findByPk(id)
    .then((product) => {
        if (!product) {
            return res.redirect('/')
        }
        const pro = product[0]
        res.render('admin/edit product',{
            doctype :"Edit Product",
            path : '/admin/edit-product',
            editing : editMode,
            product:pro,
            errorMessage : null,
            validationError : {}
        })
    })
    .catch(err => next(err))
}

exports.postEditProduct = (req,res,next) => {
        const id = req.body.productID
        const upTitle = req.body.productName
        const upImageURL = req.file
        const upPrice = req.body.price
        const upDescription = req.body.description
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
         return   res.status(422).render('admin/edit product',{
                doctype :"Edit Product",
                path : '/admin/edit-product',
                editing : true,
                product: {
                    title : upTitle,
                    price : upPrice,
                    description : upDescription,
                    id : id                
                },
                errorMessage : errors.array()[0].msg,
                validationError : errors.mapped()
            })
        }
        Product.findByPk(id)
        .then((product) => {
            if (product.userId !== req.user.id) {
                return res.redirect('/')
            }
            product.title = upTitle
            if (upImageURL) {
                 product.imageURL = upImageURL.path
                 fs.unlink(upImageURL)
            }
            product.price = upPrice
            product.description = upDescription
             product.save()
        .then(() => {
            console.log("DataBase Updated")
            res.redirect('/admin/products')
        })
        })
        .catch(err => next(err))


}

exports.postDeleteProduct = (req,res,next) => {
    const id = req.body.id
    Product.findByPk(id)
    .then(product => {
        if (product.userId !== req.user.id) {
            return res.redirect('/')
        }
        fs.unlink(product.imageURL ,(err) => {
            if (err) {
                throw err
            }
        })
        product.destroy()
        .then(() =>{
            res.redirect('/admin/products')
        })
    })
    .catch(err => next(err))
}




exports.adminProducts = (req,res,next) => {
    console.log(req.csrfToken(),333333)
    req.user.getProducts()
//  Product.findAll()
 .then((products) => {
    res.render('admin/products',{
        prods : products ,
        doctype :'Admin Products',
        path:'/admin/products',
        shopActive:true,
        shopCSS:true
    })
 })
 .catch(err => next(err))
}