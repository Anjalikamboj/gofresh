import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'KhetiSe - Fresh from Farm to Home',
  description: 'Subscribe to fresh produce and never worry about running out.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="py-8">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
