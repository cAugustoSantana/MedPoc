import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();

  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MedPoc
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive medical practice management system
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="rounded-2xl shadow-lg bg-white">
            <CardHeader>
              <h3 className="text-xl font-semibold text-center">
                Patient Management
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Efficiently manage patient records, appointments, and medical
                history.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg bg-white">
            <CardHeader>
              <h3 className="text-xl font-semibold text-center">
                Appointment Scheduling
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Streamlined appointment booking and calendar management.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg bg-white">
            <CardHeader>
              <h3 className="text-xl font-semibold text-center">
                Prescription Tracking
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Complete prescription management and medication tracking.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-x-4">
          <Link href="/sign-in">
            <Button size="lg" className="px-8">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="lg" variant="outline" className="px-8">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
