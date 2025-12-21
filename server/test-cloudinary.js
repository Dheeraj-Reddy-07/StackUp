// Test Cloudinary Configuration
// Run this in the backend to verify Cloudinary is working
require('dotenv').config();
const cloudinary = require('./config/cloudinary');

async function testCloudinary() {
    try {
        console.log('\n🔍 Testing Cloudinary Configuration...\n');

        // Check if credentials are loaded
        console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
        console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
        console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');

        // Test a simple upload with a small base64 image
        const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        console.log('\n📤 Attempting test upload...');
        const result = await cloudinary.uploader.upload(testImage, {
            folder: 'stackup/test',
            resource_type: 'auto'
        });

        console.log('\n✅ SUCCESS! Cloudinary is working!');
        console.log('Test image URL:', result.secure_url);
        console.log('\n');

    } catch (error) {
        console.log('\n❌ FAILED! Cloudinary error:');
        console.error(error.message);
        console.log('\n');
    }
}

testCloudinary();
