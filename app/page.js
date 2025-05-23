import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-pattern">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-200 opacity-30 blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-purple-200 opacity-30 blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-indigo-200 bg-white/70 backdrop-blur-sm">
              <span className="text-indigo-700 text-sm font-medium">Akademik Bitirme Projesi</span>
            </div>
            
            <div className="relative mb-6">
              <h1 className="text-gradient text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Kişiselleştirilmiş<br/>Ürün Öneri Platformu
              </h1>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-pastel rounded-full overflow-hidden">
                <div className="h-full w-full animate-shimmer"></div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
              Modern yapay zeka teknolojisi ile kullanıcılara özel ürün önerileri sağlayan akademik bitirme projesi.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/users" 
                className="btn btn-primary hover-lift group"
              >
                <span className="mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                Kullanıcı Seç
              </Link>
              <Link 
                href="/recommendations" 
                className="btn btn-outline hover-lift group"
              >
                <span className="mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3 5.5 5.5 0 0 0 12 5.5 5.5 5.5 0 0 0 7.5 3 5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </span>
                Önerileri Keşfet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative">
        <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] -translate-x-1/2 -translate-y-1/2 bg-cyan-100 opacity-20 blur-[120px] rounded-full -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-16">
            <h2 className="text-gradient text-3xl md:text-4xl font-bold relative inline-block">
              Özellikler
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 hover-lift group">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-100 mb-6 group-hover:bg-indigo-200 transition-all duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl mb-3 font-bold text-gray-800 group-hover:text-gradient transition-all duration-300">Kişiselleştirilmiş Öneriler</h3>
              <p className="text-gray-600">Kullanıcı davranışlarına dayalı olarak kişiselleştirilmiş ürün önerileri sunar.</p>
            </div>

            <div className="card p-6 hover-lift group">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-100 mb-6 group-hover:bg-purple-200 transition-all duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl mb-3 font-bold text-gray-800 group-hover:text-gradient transition-all duration-300">İçerik Tabanlı Zenginleştirme</h3>
              <p className="text-gray-600">Eksik ürün verilerini detaylı içeriklerle zenginleştirerek daha kapsamlı öneriler sağlar.</p>
            </div>

            <div className="card p-6 hover-lift group">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-cyan-100 mb-6 group-hover:bg-cyan-200 transition-all duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3 className="text-xl mb-3 font-bold text-gray-800 group-hover:text-gradient transition-all duration-300">Soğuk Başlangıç Çözümleri</h3>
              <p className="text-gray-600">Yeni kullanıcılar için popüler ürünlerle desteklenen akıllı öneri stratejileri sunar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-16">
            <h2 className="text-gradient text-3xl md:text-4xl font-bold relative inline-block">
              Teknoloji Yığını
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-6 hover-lift glass">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 mr-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Frontend</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Next.js 14 App Router</span>
                </li>
                <li className="flex items-center">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Tailwind CSS</span>
                </li>
                <li className="flex items-center">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>React Hooks</span>
                </li>
                <li className="flex items-center">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Responsive Tasarım</span>
                </li>
              </ul>
            </div>

            <div className="card p-6 hover-lift glass">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100 mr-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Backend & Veri</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Supabase (PostgreSQL)</span>
                </li>
                <li className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Reco API (Öneri Motoru)</span>
                </li>
                <li className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Catalog API (Ürün Metadatası)</span>
                </li>
                <li className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Vercel Deployment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-200 opacity-30 blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center glass p-10 rounded-xl border border-gray-200 hover-lift">
            <h2 className="mb-6 text-gradient text-3xl font-bold">Hemen Deneyin</h2>
            <p className="text-gray-600 mb-8">
              Kişiselleştirilmiş ürün önerilerini keşfetmek için başlayın
            </p>
            <Link href="/users" className="btn btn-primary hover-lift flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Kullanıcı Seçimine Git
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 