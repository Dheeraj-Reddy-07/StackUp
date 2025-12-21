// ============================================
// Seed Demo Users Script
// ============================================
// Adds demo users to the database for testing

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const demoUsers = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'demo123',
        college: 'MIT',
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        bio: 'Full stack developer passionate about building scalable web applications.'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'demo123',
        college: 'Stanford University',
        skills: ['UI/UX', 'Figma', 'Adobe XD', 'HTML/CSS'],
        bio: 'Creative UI/UX designer focused on creating beautiful user experiences.'
    },
    {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'demo123',
        college: 'UC Berkeley',
        skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
        bio: 'Backend engineer with expertise in cloud infrastructure and APIs.'
    },
    {
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        password: 'demo123',
        college: 'Harvard University',
        skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Analysis'],
        bio: 'Data scientist specializing in machine learning and AI applications.'
    },
    {
        name: 'Chris Brown',
        email: 'chris@example.com',
        password: 'demo123',
        college: 'Yale University',
        skills: ['React Native', 'iOS', 'Android', 'Flutter'],
        bio: 'Mobile developer creating cross-platform applications for smartphones.'
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing demo users (optional - comment out if you want to keep them)
        console.log('🗑️  Removing existing demo users...');
        const emails = demoUsers.map(user => user.email);
        await User.deleteMany({ email: { $in: emails } });
        console.log('✅ Cleared existing demo users\n');

        // Create demo users
        console.log('👥 Creating demo users...\n');

        for (const userData of demoUsers) {
            const user = await User.create(userData);
            console.log(`✅ Created user: ${user.name} (${user.email})`);
            console.log(`   College: ${user.college}`);
            console.log(`   Skills: ${user.skills.join(', ')}`);
            console.log(`   Password: demo123\n`);
        }

        console.log('🎉 Successfully seeded database with demo users!\n');
        console.log('='.repeat(60));
        console.log('DEMO USER CREDENTIALS (Password: demo123 for all)');
        console.log('='.repeat(60));
        demoUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   College: ${user.college}`);
            console.log(`   Role: ${user.bio.split(' ')[0]}`);
            console.log('');
        });
        console.log('='.repeat(60));

        // Disconnect
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
