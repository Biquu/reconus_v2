'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center h-24">

          {/* Sadece Logo */}
          <Link 
            href="/" 
            className="group transition-all duration-300 hover:scale-110"
          >
            <div className="relative">
          <Image
            src="/logos/logo-light.png"
            alt="Reconus"
                width={120}
                height={120}
                className="rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-300"
            priority
          />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300"></div>
            </div>
          </Link>

        </div>
      </div>
    </nav>
  );
}

// Navigation Item Component
function NavItem({ href, icon, label, active, color }) {
  const colorClasses = {
    blue: active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'text-slate-300 hover:text-white hover:bg-slate-800/50',
    red: active ? 'bg-red-600 text-white shadow-lg shadow-red-600/25' : 'text-slate-300 hover:text-white hover:bg-slate-800/50',
    green: active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' : 'text-slate-300 hover:text-white hover:bg-slate-800/50',
    purple: active ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
  };

  return (
    <Link
      href={href}
      className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${colorClasses[color]}`}
      title={label}
    >
      <div className="w-5 h-5 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <span className="text-sm font-medium tracking-wide hidden lg:block">
        {label}
      </span>
    </Link>
  );
}

// Professional SVG Icons
function UsersIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

// Animasyon için globals.css dosyasına aşağıdaki stil eklenmelidir:
// @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
// @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
// @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
// .animate-spin-slow { animation: spin-slow 8s linear infinite; }
// .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
// .animate-fade-in { animation: fade-in 0.5s ease-out; }
 