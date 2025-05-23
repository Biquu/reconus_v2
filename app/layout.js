import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata = {
  title: 'Reconus - Ürün Öneri Platformu',
  description: 'Alışveriş alışkanlıklarınıza göre kişiselleştirilmiş ürün önerileri',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="py-6 border-t">
              <div className="max-w-7xl mx-auto px-6 text-center text-sm" style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground-muted)' }}>
                © {new Date().getFullYear()} Reconus. Tüm hakları saklıdır.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
} 