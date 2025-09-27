import '../styles/globals.css';

export const metadata = {
  title: 'Large Event Platform - Admin Portal',
  description: 'Admin portal for managing large events',
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
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}