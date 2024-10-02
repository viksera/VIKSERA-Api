const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Category = require("./category")
const Product = sequelize.define("products", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Category,
            key: 'id',
        },
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

    
}, {
    timestamps: false
})

Product.beforeUpdate((product) => {
    product.updated_at = new Date();
})

module.exports = Product;