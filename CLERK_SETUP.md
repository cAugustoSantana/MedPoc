# Clerk Authentication Setup

This guide will help you set up Clerk authentication for your MedPoc application.

## Prerequisites

1. A Clerk account (sign up at [clerk.com](https://clerk.com))
2. Node.js and pnpm installed

## Setup Steps

### 1. Create a Clerk Application

1. Go to [clerk.com](https://clerk.com) and sign up/login
2. Create a new application
3. Choose "Next.js" as your framework
4. Note down your Publishable Key and Secret Key

### 2. Configure Environment Variables

1. Copy the `env.example` file to `.env.local`:

   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Clerk keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   ```

### 3. Configure Clerk Application Settings

1. In your Clerk dashboard, go to "User & Authentication" → "Email, Phone, Username"
2. Enable the authentication methods you want (Email, Phone, Username, etc.)
3. Go to "Paths" and configure:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

### 4. Run the Application

```bash
pnpm dev
```

## Features Added

- **Authentication Middleware**: Basic Clerk middleware for authentication
- **Sign-in Page**: `/sign-in` - Custom styled sign-in form
- **Sign-up Page**: `/sign-up` - Custom styled sign-up form
- **Dashboard**: Protected dashboard with user information
- **User Button**: Sign-out functionality in the header
- **Route Protection**: Automatic redirection for unauthenticated users

## Route Protection

The middleware is configured to protect all routes by default. You can customize the protection by:

1. **In Clerk Dashboard**: Configure which routes should be public in your Clerk application settings
2. **In Code**: Modify the middleware to add custom route protection logic

## Public Routes

By default, Clerk will handle route protection based on your application settings. You can configure public routes in your Clerk dashboard under "Paths" settings.

## Protected Routes

All routes are protected by default and will redirect to `/sign-in` if the user is not authenticated.

## User Experience

1. **Landing Page**: Shows a welcome page with sign-in/sign-up buttons
2. **Authentication**: Users can sign in or sign up using Clerk's UI
3. **Dashboard**: After authentication, users are redirected to the dashboard
4. **Navigation**: The sidebar and navigation work as before, but now with user context
5. **Sign Out**: Users can sign out using the user button in the header

## Customization

You can customize the Clerk components by modifying:

- `app/sign-in/[[...sign-in]]/page.tsx` - Sign-in page styling
- `app/sign-up/[[...sign-up]]/page.tsx` - Sign-up page styling
- `app/dashboard/page.tsx` - Dashboard content and layout

## Next Steps

1. Set up your Clerk application and add the environment variables
2. Test the authentication flow
3. Customize the UI to match your brand
4. Add user roles and permissions if needed
5. Integrate user data with your existing database schema
