const {Sequelize,DataTypes} = require('sequelize/index')
const sequelize = require('../util/database')

const Product = sequelize.define('product',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    imageURL:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.DOUBLE,
        allowNull:false
    }
})
module.exports = Product