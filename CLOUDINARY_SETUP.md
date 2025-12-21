# How to Get Cloudinary Credentials

## What is Cloudinary?
Cloudinary is a free cloud service for storing and managing images and files. StackUp uses it to store user resumes and attachments.

## Steps to Get Your Free Cloudinary Account

### 1. Sign Up (Free)
1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Fill in your details:
   - Email
   - Password
   - Choose a cloud name (this will be your `CLOUDINARY_CLOUD_NAME`)
3. Click "Create Account"

### 2. Verify Your Email
Check your email and click the verification link

### 3. Get Your Credentials
1. After logging in, you'll see your Dashboard
2. Look for the section called **"Account Details"** or **"API Keys"**
3. You'll see three important values:
   - **Cloud Name** - This is your `CLOUDINARY_CLOUD_NAME`
   - **API Key** - This is your `CLOUDINARY_API_KEY`
   - **API Secret** - This is your `CLOUDINARY_API_SECRET`

### 4. Add to Your `.env` File
Open `server/.env` and paste:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Example
If your dashboard shows:
- Cloud Name: `stackup-demo`
- API Key: `123456789012345`
- API Secret: `abcdefGHIJKLMNOP1234567890`

Your `.env` should have:
```env
CLOUDINARY_CLOUD_NAME=stackup-demo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefGHIJKLMNOP1234567890
```

## That's It!
The Cloudinary credentials are already configured in the backend code. Once you add these values to `.env`, file uploads will work automatically!

## Free Tier Limits
- 25 GB storage
- 25 GB bandwidth/month
- More than enough for a personal portfolio project!
