import Navigation from '../components/Navigation';
import '../styles/globals.css';

export const metadata = {
  title: 'Large Event Platform - User Portal',
  description: 'User portal for accessing large event services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; 2025 Large Event Platform. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}