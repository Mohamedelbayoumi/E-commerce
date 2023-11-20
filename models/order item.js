const {Sequelize,DataTypes} = require('sequelize/index')
const sequelize = require('../util/database')

const orderItem = sequelize.define('orderItem',{
    id : {
        primaryKey:true,
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true
    },
    quantity:{
        type:DataTypes.INTEGER
    }
})

module.exports = orderItem