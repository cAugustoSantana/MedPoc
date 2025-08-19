import { Toaster } from '@/components/ui/sonner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {children}
      <Toaster />
    </div>
  );
}
