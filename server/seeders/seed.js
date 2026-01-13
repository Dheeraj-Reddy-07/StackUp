const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User, Opening } = require('../models');
require('dotenv').config();

// Color codes for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    yellow: "\x1b[33m",
    red: "\x1b[31m"
};

const seedDatabase = async () => {
    try {
        console.log(`${colors.blue}🌱 Starting authentic database seeding...${colors.reset}`);

        // Initialize Sequelize with existing config
        const sequelize = process.env.DATABASE_URL
            ? new Sequelize(process.env.DATABASE_URL, {
                dialect: 'postgres',
                logging: false,
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
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
                    logging: false
                }
            );

        await sequelize.authenticate();
        console.log(`${colors.green}✅ Connected to database${colors.reset}`);

        // ==========================================
        // 1. Create Users (Authentic Indian Profiles)
        // ==========================================
        console.log(`${colors.yellow}Creating Users...${colors.reset}`);

        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = await User.bulkCreate([
            {
                name: "Arjun Mehta",
                email: "arjun.dev@gmail.com",
                password: hashedPassword,
                role: "Full Stack Developer",
                skills: ["MERN Stack", "Next.js", "Docker", "AWS"],
                bio: "Final year CS student at IIT Delhi. Won 2 hackathons previously. Looking for a strong team for SIH 2024 to build something in AgriTech.",
                github_url: "https://github.com/arjun-codes",
                portfolio_url: "https://arjun.dev"
            },
            {
                name: "Priya Sharma",
                email: "priya.design@outlook.com",
                password: hashedPassword,
                role: "UI/UX Designer",
                skills: ["Figma", "Adobe XD", "Protopie", "Frontend"],
                bio: "Passionate about creating accessible designs. I turn complex problems into simple, beautiful interfaces. Seeking a team for design-centric tracks.",
                github_url: "https://github.com/priyadesigns"
            },
            {
                name: "Rohan Verma",
                email: "rohan.blockchain@yahoo.com",
                password: hashedPassword,
                role: "Blockchain Developer",
                skills: ["Solidity", "Ether.js", "Rust", "Web3"],
                bio: "Building decentralized apps on Polygon. Need a frontend dev to connect my smart contracts for ETHIndia.",
                github_url: "https://github.com/rohan-web3"
            },
            {
                name: "Ananya Iyer",
                email: "ananya.ml@gmail.com",
                password: hashedPassword,
                role: "AI/ML Engineer",
                skills: ["Python", "TensorFlow", "OpenCV", "NLP"],
                bio: "Researching Computer Vision applications for rural healthcare. Let's solve real Indian problems with AI.",
                github_url: "https://github.com/ananya-ai"
            },
            {
                name: "Vikram Singh",
                email: "vikram.backend@gmail.com",
                password: hashedPassword,
                role: "Backend Architect",
                skills: ["Go", "Microservices", "Kubernetes", "Redis"],
                bio: "Performance obsessed backend engineer. I scale systems to handle millions of requests.",
                github_url: "https://github.com/vikram-builds"
            }
        ]);

        console.log(`${colors.green}✅ Created ${users.length} users${colors.reset}`);

        // ==========================================
        // 2. Create Openings (Real Hackathon Projects)
        // ==========================================
        console.log(`${colors.yellow}Creating Openings...${colors.reset}`);

        const openings = await Opening.bulkCreate([
            {
                userId: users[0].id, // Arjun
                title: "KisanConnect - Smart Mandi System",
                company: "Smart India Hackathon 2024",
                location: "Remote / Noida",
                type: "Software Edition",
                description: "Problem Statement: 1284 - Digital solution for farmers to sell directly to consumers. We are building a blockchain-based supply chain app to eliminate middlemen. Need a blockchain dev and a UI designer.",
                requirements: [
                    "Knowledge of Supply Chain logic",
                    "React Native for mobile app",
                    "Solidity basics is a plus"
                ],
                status: "active"
            },
            {
                userId: users[3].id, // Ananya
                title: "RuralHealth AI - Diagnostics App",
                company: "Google Solution Challenge",
                location: "Bangalore / Hybrid",
                type: "AI for Good",
                description: "Developing an offline-first mobile app that uses on-device ML to detect skin diseases in remote villages. Need an Android developer comfortable with TensorFlow Lite.",
                requirements: [
                    "Flutter or Kotlin",
                    "TensorFlow Lite integration",
                    "Experience with offline databases (WatermelonDB/SQLite)"
                ],
                status: "active"
            },
            {
                userId: users[2].id, // Rohan
                title: "DeFi Lending Protocol",
                company: "ETHIndia 2024",
                location: "Bangalore",
                type: "Web3 Hackathon",
                description: "Building a decentralized peer-to-peer lending platform on Polygon. Core contracts are ready, checking for a frontend dev to build the dashboard using RainbowKit and Wagmi.",
                requirements: [
                    "React.js & TailwindCSS",
                    "Experience with Web3.js or Ethers.js",
                    "Understanding of DeFi mechanics"
                ],
                status: "active"
            },
            {
                userId: users[1].id, // Priya
                title: "EduSetu - Vernacular Learning",
                company: "HackMumbai",
                location: "Mumbai / Remote",
                type: "EdTech",
                description: "Creating a gamified learning platform for tier-2/3 city students in local languages. We focus heavily on UX and engagement.",
                requirements: [
                    "Gamification logic",
                    "Full Stack Developer (MERN)",
                    "Passion for education"
                ],
                status: "active"
            }
        ]);

        console.log(`${colors.green}✅ Created ${openings.length} openings${colors.reset}`);

        console.log(`${colors.blue}🎉 Authentic mock data seeded successfully!${colors.reset}`);
        process.exit(0);

    } catch (error) {
        console.error(`${colors.red}❌ Seeding failed:${colors.reset}`, error);
        process.exit(1);
    }
};

seedDatabase();
