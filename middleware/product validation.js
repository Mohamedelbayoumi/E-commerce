const {body} = require('express-validator')

exports.checkProductName = () => {
   return body('productName','Title should be only text with minimum 3 characters').trim().isAlpha().isLength({min:3})
}

// exports.checkImage = () =>{
//    return body('image','Attach a URL for the image').trim().isURL()
// }

exports.checkPrice = () => {
    return body('price','Invalid Price').trim().isFloat()
}

exports.checkDescription = ()=> {
    return body('description','Description should be between 5 and 200 characters').trim().isLength({min : 5,max : 200})
}