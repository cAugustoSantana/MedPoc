# Medical Staff Onboarding Setup

This document explains how to set up and use the medical staff onboarding system in MedPoc.

## Overview

The onboarding system provides a multi-step form for new medical staff (doctors and assistants) to complete their profile setup after signing up through Clerk authentication.

## Features

- **Multi-step form** with progress indicator
- **Role selection** (Doctor or Medical Assistant)
- **Professional information collection** (name, specialty, experience)
- **Document verification** (ID, license, etc.)
- **Education and certification tracking**
- **Automatic role assignment** based on selection
- **Responsive design** with shadcn/ui components

## Setup Instructions

### 1. Database Setup

First, ensure you have the required database tables and roles:

```bash
# Generate and run migrations
pnpm db:generate
pnpm db:migrate

# Seed the roles table
pnpm db:seed
```

### 2. Clerk Configuration

Update your Clerk dashboard settings:

1. Go to your Clerk Dashboard
2. Navigate to **User & Authentication** → **Redirect URLs**
3. Set the **After sign-up URL** to: `/onboarding`
4. Set the **After sign-in URL** to: `/dashboard`

### 3. Environment Variables

Ensure your environment variables are properly configured:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Database
DATABASE_URL=your_database_url
```

## How It Works

### 1. User Flow

1. **Sign Up**: User signs up through Clerk
2. **Redirect**: Automatically redirected to `/onboarding`
3. **Profile Setup**: Completes the 5-step onboarding form
4. **Completion**: Redirected to `/dashboard` with full access

### 2. Onboarding Steps

1. **Personal Information**

   - Full name (required)
   - Phone number (optional)

2. **Role Selection**

   - Choose between Doctor or Medical Assistant (required)

3. **Medical Specialty**

   - Specialty selection (required)
   - Years of experience (optional)

4. **Professional Details**

   - Document type and number (required)

5. **Education & Experience**
   - Education history (optional)
   - Certifications (optional)
   - Review summary

### 3. Security Features

- **Authentication required**: Only authenticated users can access onboarding
- **Role-based access**: Automatically assigns role based on user selection (roleId: 1 for Doctor, roleId: 2 for Assistant)
- **Data validation**: Required fields are validated before proceeding
- **Profile completion check**: Users can't access the main app without completing onboarding

## File Structure

```
app/(app)/onboarding/
├── page.tsx          # Main onboarding form
├── actions.ts        # Server actions for form submission
└── layout.tsx        # Layout without sidebar

lib/
└── auth-utils.ts     # Authentication utilities including onboarding check

scripts/
└── seed-roles.ts     # Database seeding for roles
```

## Customization

### Adding New Fields

1. Update the `OnboardingData` interface in `page.tsx`
2. Add the field to the form in the appropriate step
3. Update the `completeOnboardingAction` to handle the new field
4. Consider adding the field to the database schema if needed

### Modifying Steps

1. Update the `steps` array in `page.tsx`
2. Add the corresponding case in `renderStepContent()`
3. Update validation logic in `validateCurrentStep()`

### Styling

The onboarding form uses shadcn/ui components and can be customized by:

- Modifying the component styles in `components/ui/`
- Updating the Tailwind classes in `page.tsx`
- Customizing the color scheme and layout

## Troubleshooting

### Common Issues

1. **Onboarding not redirecting**: Check Clerk redirect URLs
2. **Database errors**: Ensure migrations are up to date
3. **Role not found**: Run the seed script (`pnpm db:seed`)
4. **Form not submitting**: Check server action permissions

### Debug Mode

To debug onboarding issues:

1. Check browser console for client-side errors
2. Check server logs for server action errors
3. Verify database connection and schema
4. Test authentication flow

## Production Considerations

1. **Data validation**: Add more robust validation
2. **File uploads**: Consider adding document upload functionality
3. **Email verification**: Implement email verification for doctors
4. **Admin approval**: Add admin approval workflow if needed
5. **Audit trail**: Log onboarding completion events
