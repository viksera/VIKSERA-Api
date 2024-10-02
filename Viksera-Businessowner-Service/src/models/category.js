const { DataTypes, DATE } = require("sequelize");
const sequelize = require("../config/sequelize");

const Category = sequelize.define("categories", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    object_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    redirect_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, 
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false
});

Category.beforeUpdate((category) => {
    category.updated_at = new Date();
});

module.exports = Category;