const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')

const Banner = sequelize.define('banners', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    object_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
    target_audience: {
        type: DataTypes.ENUM('business', 'marketing agency', 'influencer', 'all'),
        defaultValue: 'all',
        allowNull: false,
    },
    expires_on: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    // Additional options can be added here
    timestamps: false, // Disable automatic timestamps since you're using custom ones
});

// Optional: Hook to update `updated_at` before saving
Banner.beforeUpdate((banner) => {
    banner.updated_at = new Date();
});

module.exports = Banner;
