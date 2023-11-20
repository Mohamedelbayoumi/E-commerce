const {Sequelize,DataTypes} = require('sequelize/index')
const sequelize = require('../util/database')

const Cart = sequelize.define('cart',{
    id : {
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    }
})
module.exports = Cart