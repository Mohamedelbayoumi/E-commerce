exports.notFound = (req,res) => {
    // res.status(404).sendFile(path.join(__dirname,'views','not found.html'))
    res.status(404).render('not found',{
        doctype :'Page Not Found',
        path:''
        })
}

exports.show500 = (req,res) => {
    res.status(500).render('500',{
        doctype : 'Server is down',
        path : ''
    })
}