# MedPoc - Medical Practice Management System

A comprehensive medical practice management system built with Next.js, featuring patient management, appointment scheduling, prescription tracking, and secure authentication.

## 🚀 Features

### 🔐 Authentication & Security

- **Clerk Authentication**: Complete user authentication system
- **Protected Routes**: Automatic route protection with middleware
- **User Management**: Sign-in, sign-up, and user profile management
- **Session Management**: Secure session handling and automatic redirects

### 📋 Core Functionality

- **Patient Management**: Add, edit, delete, and search patients
- **Appointment Scheduling**: Create and manage appointments with availability tracking
- **Prescription Management**: Track prescriptions and medication history
- **Dashboard**: Overview with quick stats and recent activity
- **Responsive Design**: Mobile-friendly interface with sidebar navigation

### 🛠 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Tables**: TanStack Table with advanced filtering and sorting

## 🏗 Project Structure

```
app/
├── (auth)/                    # Authentication pages (no sidebar)
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   └── layout.tsx
├── (app)/                     # Main application pages (with sidebar)
│   ├── dashboard/page.tsx
│   ├── patient/page.tsx
│   ├── appointments/page.tsx
│   ├── prescriptions/page.tsx
│   ├── settings/page.tsx
│   ├── records/page.tsx
│   └── layout.tsx
├── api/                       # API routes
├── layout.tsx                 # Root layout
└── page.tsx                   # Landing page
```

## 🔧 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Clerk account

### 1. Clone and Install

```bash
git clone <repository-url>
cd MedPoc
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/medpoc"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Database Setup

```bash
# Generate and run migrations
pnpm db:generate
pnpm db:migrate

# Or push schema directly
pnpm db:push
```

### 4. Clerk Configuration

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your Publishable Key and Secret Key to `.env.local`
4. Configure paths in Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔐 Authentication Flow

### User Experience

1. **Landing Page**: Public welcome page with sign-in/sign-up options
2. **Authentication**: Clean, centered sign-in/sign-up forms
3. **Dashboard**: Protected dashboard with user information and navigation
4. **App Navigation**: Full sidebar navigation for authenticated users
5. **Sign Out**: User button in header for easy sign-out

### Route Protection

- **Public Routes**: `/`, `/sign-in`, `/sign-up`
- **Protected Routes**: All app pages require authentication
- **Automatic Redirects**: Unauthenticated users redirected to sign-in

### Security Features

- **Middleware Protection**: All routes protected by Clerk middleware
- **Session Validation**: Automatic session token validation
- **CSRF Protection**: Built-in protection against cross-site request forgery
- **Secure Headers**: Automatic security headers via Next.js

## 📱 Key Components

### Authentication Components

- `app/(auth)/layout.tsx` - Clean layout for auth pages
- `app/(auth)/sign-in/[[...sign-in]]/page.tsx` - Sign-in form
- `app/(auth)/sign-up/[[...sign-up]]/page.tsx` - Sign-up form

### Application Components

- `app/(app)/layout.tsx` - Main app layout with sidebar
- `app/(app)/dashboard/page.tsx` - Dashboard with user info
- `components/patient-table.tsx` - Advanced patient management table
- `components/add-patient-dialog.tsx` - Patient creation dialog
- `components/add-appointment-dialog.tsx` - Appointment scheduling

### Configuration Files

- `middleware.ts` - Clerk authentication middleware
- `env.example` - Environment variables template
- `CLERK_SETUP.md` - Detailed Clerk setup guide

## 🚀 Deployment

### Vercel Deployment

1. **Environment Variables**: Add all environment variables to Vercel
2. **Database**: Ensure database is accessible from Vercel
3. **Clerk**: Configure production Clerk application
4. **Deploy**: Push to GitHub and connect to Vercel

### Environment Variables for Production

```env
# Database
DATABASE_URL=your_production_database_url

# Clerk (Production Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 🛠 Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio
```

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs) - Authentication setup and configuration
- [Next.js Documentation](https://nextjs.org/docs) - Framework features and API
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM documentation
- [shadcn/ui](https://ui.shadcn.com/) - UI component library

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

Dummy change.
