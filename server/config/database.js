// ============================================
// PostgreSQL Database Configuration
// ============================================
// This file handles the connection to PostgreSQL using Sequelize.
// It includes configuration for different environments.

const { Sequelize } = require('sequelize');

/**
 * Initialize Sequelize instance with PostgreSQL connection
 */
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',

        // Logging - set to false in production
        logging: process.env.NODE_ENV === 'development' ? console.log : false,

        // Connection pool configuration
        pool: {
            max: 5,           // Maximum number of connections
            min: 0,           // Minimum number of connections
            acquire: 30000,   // Maximum time (ms) to try getting connection
            idle: 10000       // Maximum time (ms) a connection can be idle
        },

        // Define default options for all models
        define: {
            timestamps: true,           // Adds createdAt and updatedAt
            underscored: false,         // Use camelCase for column names
            freezeTableName: false,     // Pluralize table names
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
