// ============================================
// PostgreSQL Database Configuration
// ============================================
// This file handles the connection to PostgreSQL using Sequelize.
// It includes configuration for different environments.

const { Sequelize } = require('sequelize');

/**
 * Initialize Sequelize instance with PostgreSQL connection
 * Supports both DATABASE_URL and individual env vars
 */
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: false,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            define: {
                timestamps: true,
                underscored: false,
                freezeTableName: false,
                createdAt: 'createdAt',
                updatedAt: 'updatedAt'
            }
        }
    );

/**
 * Test database connection
 */
const connectDB = async () => {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Connected successfully');

        // Sync all models with database
        // { alter: true } updates tables to match models without dropping data
        // { force: true } would drop and recreate (use only in development!)
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');

    } catch (error) {
        console.error('❌ Unable to connect to PostgreSQL:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
