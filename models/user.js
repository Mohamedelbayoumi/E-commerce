const {DataTypes} =require('sequelize')
const sequelize = require('../util/database')

const User = sequelize.define('user',{
    id : {
        allowNull:false,
        primaryKey:true,
        type:DataTypes.INTEGER,
        autoIncrement:true
    },
    email:{
        type:DataTypes.STRING,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    resetToken : {
        type : DataTypes.STRING
    },
    resetTokenExpiration : {
        type : DataTypes.DATE
    }

})

// const queryInterface = sequelize.getQueryInterface
// queryInterface.addColumn('resetToken',{type : DataTypes.STRING})
// queryInterface.addColumn('resetTokenExpiration',{type : DataTypes.DATE})

module.exports = User