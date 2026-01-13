# PostgreSQL Setup Guide for Windows

Welcome to PostgreSQL! This guide will walk you through everything you need to know to set up and use PostgreSQL for your StackUp application.

## What is PostgreSQL?

PostgreSQL (often called "Postgres") is a powerful, open-source **relational database**. Unlike MongoDB (which is a NoSQL database), PostgreSQL stores data in **tables with rows and columns** - similar to Excel spreadsheets, but much more powerful.

### Key Differences from MongoDB

| Feature | MongoDB | PostgreSQL |
|---------|---------|------------|
| **Data Structure** | Documents (JSON-like) | Tables (rows & columns) |
| **Schema** | Flexible, schemaless | Fixed schema with data types |
| **Queries** | MongoDB query language | SQL (Structured Query Language) |
| **Relationships** | Manual references | Built-in foreign keys |
| **Best For** | Flexible, evolving data | Structured, relational data |

---

## Step 1: Install PostgreSQL on Windows

### Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click **"Download the installer"**
3. Choose the **latest version** (16.x or 15.x) for **Windows x86-64**
4. Run the downloaded `.exe` file

### Installation Steps

1. **Select Installation Directory**: Use default (`C:\Program Files\PostgreSQL\16` or similar)

2. **Select Components**: Keep all defaults checked:
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (graphical interface)
   - ✅ Stack Builder (optional tools)
   - ✅ Command Line Tools

3. **Data Directory**: Keep default (`C:\Program Files\PostgreSQL\16\data`)

4. **Password**: 
   - **IMPORTANT**: You'll be asked to set a password for the `postgres` superuser
   - Choose a strong password and **WRITE IT DOWN** - you'll need it!
   - Example: `MySecurePassword123`

5. **Port**: Keep default **5432**

6. **Locale**: Keep default

7. Click **Next** and **Finish** the installation

### Verify Installation

1. Open **Command Prompt** (Win + R, type `cmd`)
2. Type: 
   ```bash
   psql --version
   ```
3. You should see something like: `psql (PostgreSQL) 16.1`

---

## Step 2: Create Your Database

### Option A: Using pgAdmin (Graphical Interface - Recommended for Beginners)

1. **Open pgAdmin 4**
   - Search for "pgAdmin" in Windows Start Menu
   - Enter the master password you set during installation

2. **Connect to Server**
   - In the left panel, expand **Servers**
   - Click on **PostgreSQL 16** (or your version)
   - Enter your password when prompted

3. **Create Database**
   - Right-click on **Databases** → **Create** → **Database**
   - Database name: `stackup`
   - Owner: `postgres`
   - Click **Save**

4. **Verify Creation**
   - You should now see `stackup` under Databases in the left panel

### Option B: Using Command Line (psql)

1. Open **Command Prompt** or **PowerShell**

2. Connect to PostgreSQL:
   ```bash
   psql -U postgres
   ```
   - Enter your password when prompted

3. Create the database:
   ```sql
   CREATE DATABASE stackup;
   ```

4. List databases to verify:
   ```sql
   \l
   ```
   - You should see `stackup` in the list

5. Exit psql:
   ```sql
   \q
   ```

---

## Step 3: Understanding PostgreSQL Basics

### What is SQL?

SQL (Structured Query Language) is how you communicate with PostgreSQL. Here are some basic commands:

```sql
-- Create a table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert data
INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');

-- Query data
SELECT * FROM users;

-- Update data
UPDATE users SET name = 'Jane Doe' WHERE email = 'john@example.com';

-- Delete data
DELETE FROM users WHERE email = 'john@example.com';
```

**Don't worry!** With Sequelize (our ORM), you won't need to write raw SQL - it generates SQL for you from JavaScript code.

---

## Step 4: What is Sequelize?

**Sequelize** is an ORM (Object-Relational Mapping) library - think of it as the PostgreSQL equivalent of Mongoose for MongoDB.

### How Sequelize Works

Instead of writing SQL:
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```

You write JavaScript:
```javascript
await User.findOne({ where: { email: 'test@example.com' } });
```

Sequelize automatically converts your JavaScript code into SQL queries!

### Sequelize vs Mongoose Comparison

| Task | Mongoose (MongoDB) | Sequelize (PostgreSQL) |
|------|-------------------|------------------------|
| **Define Model** | `new Schema({ name: String })` | `sequelize.define('User', { name: DataTypes.STRING })` |
| **Create Record** | `User.create({ name: 'John' })` | `User.create({ name: 'John' })` ✅ Same! |
| **Find All** | `User.find()` | `User.findAll()` |
| **Find One** | `User.findOne({ email: 'test@test.com' })` | `User.findOne({ where: { email: 'test@test.com' } })` |
| **Update** | `user.save()` | `user.save()` ✅ Same! |
| **Delete** | `user.remove()` | `user.destroy()` |
| **Populate/Join** | `.populate('creator')` | `.include({ model: User })` |

---

## Step 5: Configure Your StackUp Project

### Update .env File

Create/update your `server/.env` file with:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stackup
DB_USER=postgres
DB_PASSWORD=YourPasswordHere

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Replace `YourPasswordHere`** with the password you set during PostgreSQL installation!

---

## Step 6: Common PostgreSQL Commands

### Using pgAdmin

**View Tables**:
1. Expand: Servers → PostgreSQL 16 → Databases → stackup → Schemas → public → Tables
2. Right-click a table → View/Edit Data → All Rows

**Run SQL Queries**:
1. Right-click `stackup` database → Query Tool
2. Write SQL and click **Execute** (▶️ button)

### Using psql Command Line

```bash
# Connect to database
psql -U postgres -d stackup

# List all tables
\dt

# Describe a table
\d users

# Run a query
SELECT * FROM users;

# Exit
\q
```

---

## Step 7: Troubleshooting

### "psql: command not found"

**Solution**: Add PostgreSQL to PATH
1. Search "Environment Variables" in Windows
2. Edit "Path" variable
3. Add: `C:\Program Files\PostgreSQL\16\bin`
4. Restart Command Prompt

### "password authentication failed"

**Solution**: Double-check your password in the `.env` file matches the one you set during installation.

### "database does not exist"

**Solution**: Make sure you created the `stackup` database (see Step 2).

### Server won't connect to database

1. Check PostgreSQL service is running:
   - Open Services (Win + R → `services.msc`)
   - Look for `postgresql-x64-16` (or your version)
   - Status should be "Running"
   - If not, right-click → Start

---

## Step 8: Useful Tools

### pgAdmin 4
- **What**: Graphical interface for PostgreSQL
- **Use it for**: Viewing data, running queries, managing databases
- **Like**: MongoDB Compass for MongoDB

### DBeaver (Alternative)
- **What**: Universal database tool
- **Download**: https://dbeaver.io/
- **Use it for**: More advanced SQL editing and visualization

---

## Next Steps

Once PostgreSQL is installed and configured:

1. ✅ Make sure PostgreSQL service is running
2. ✅ Database `stackup` is created
3. ✅ `.env` file has correct credentials
4. ✅ Run `npm install` to install Sequelize and dependencies
5. ✅ Start your server with `npm run dev`

Sequelize will **automatically create all tables** for you based on your models when the server starts for the first time!

---

## Quick Reference: PostgreSQL Data Types

When you see these in Sequelize models:

| Sequelize Type | PostgreSQL Type | Example |
|----------------|----------------|---------|
| `DataTypes.STRING` | VARCHAR(255) | "John Doe" |
| `DataTypes.TEXT` | TEXT | Long text, no limit |
| `DataTypes.INTEGER` | INTEGER | 42 |
| `DataTypes.BOOLEAN` | BOOLEAN | true/false |
| `DataTypes.DATE` | TIMESTAMP | 2024-01-13 12:00:00 |
| `DataTypes.JSONB` | JSONB | { "key": "value" } |
| `DataTypes.ARRAY(DataTypes.STRING)` | TEXT[] | ["tag1", "tag2"] |
| `DataTypes.ENUM('a', 'b')` | ENUM | 'a' or 'b' only |

---

## Getting Help

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Sequelize Docs**: https://sequelize.org/docs/v6/
- **SQL Tutorial**: https://www.sqltutorial.org/

🎉 You're now ready to use PostgreSQL with your StackUp application!
