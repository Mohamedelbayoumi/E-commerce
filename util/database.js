const {Sequelize} = require('sequelize/index')
// const Op = Sequelize.Op
const sequelize = new Sequelize('node-complete','root','mentafi',
{dialect:'mysql',host:'localhost',port:3000})

module.exports = sequelize





// const mysql = require('mysql2')
// const pool = mysql.createPool({
// host:'localhost',
// user:'root',
// database:'node-complete',
// password:'mentafi',
// port:3000
// })
// module.exports = pool.promise()