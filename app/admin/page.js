'use client';

import { useState, useEffect } from 'react';
import supabase from '../../lib/supabaseClient';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0,
    avgProductRating: 0,
    topCategories: [],
    recentUsers: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    document.title = 'Admin Paneli - Reconus';
  }, []);
  
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        
        // Toplam ürün sayısı
        const { count: productCount, error: productError } = await supabase
          .from('product_table')
          .select('*', { count: 'exact', head: true });
          
        if (productError) throw productError;
        
        // Toplam kullanıcı sayısı
        const { count: userCount, error: userError } = await supabase
          .from('users_table')
          .select('*', { count: 'exact', head: true });
          
        if (userError) throw userError;
        
        // Toplam kategori sayısı
        const { count: categoryCount, error: categoryError } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });
          
        if (categoryError) throw categoryError;
        
        // Ortalama ürün puanı
        const { data: ratingData, error: ratingError } = await supabase
          .from('product_table')
          .select('avg_rating')
          .not('avg_rating', 'is', null);
          
        if (ratingError) throw ratingError;
        
        let avgRating = 0;
        if (ratingData.length > 0) {
          const sum = ratingData.reduce((acc, product) => acc + product.avg_rating, 0);
          avgRating = sum / ratingData.length;
        }
        
        // En popüler kategoriler
        const { data: popularCategories, error: categoriesError } = await supabase
          .from('product_table')
          .select('category_name, count')
          .not('category_name', 'is', null)
          .group('category_name')
          .order('count', { ascending: false })
          .limit(5);
          
        if (categoriesError) throw categoriesError;
        
        // Son kullanıcılar
        const { data: recentUsers, error: recentUsersError } = await supabase
          .from('users_table')
          .select('user_id, city, state, total_orders, last_purchase_ts')
          .order('last_purchase_ts', { ascending: false })
          .limit(5);
          
        if (recentUsersError) throw recentUsersError;
        
        setStats({
          totalProducts: productCount,
          totalUsers: userCount,
          totalCategories: categoryCount,
          avgProductRating: avgRating,
          topCategories: popularCategories || [],
          recentUsers: recentUsers || []
        });
      } catch (err) {
        console.error('İstatistikler alınırken hata oluştu:', err);
        setError('İstatistikler yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);
  
  // Yükleme durumu
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">İstatistikler yükleniyor...</p>
      </div>
    );
  }
  
  // Hata durumu
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Hata! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Paneli</h1>
        <p className="text-gray-600">
          Sistem istatistiklerini ve genel durumu bu panel üzerinden izleyebilirsiniz.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium text-gray-900 mb-1">{stats.totalProducts.toLocaleString()}</h2>
          <p className="text-gray-500">Toplam Ürün</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium text-gray-900 mb-1">{stats.totalUsers.toLocaleString()}</h2>
          <p className="text-gray-500">Toplam Kullanıcı</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium text-gray-900 mb-1">{stats.totalCategories.toLocaleString()}</h2>
          <p className="text-gray-500">Kategori Sayısı</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium text-gray-900 mb-1">{stats.avgProductRating.toFixed(1)}</h2>
          <p className="text-gray-500">Ortalama Ürün Puanı</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Son Kullanıcılar */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Son Kullanıcılar</h2>
          
          {stats.recentUsers.length === 0 ? (
            <p className="text-gray-500">Kullanıcı verisi bulunamadı.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Konum
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sipariş
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Son Satın Alma
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentUsers.map((user) => (
                    <tr key={user.user_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.user_id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.city}, {user.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.total_orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.last_purchase_ts).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Mesajlar ve Bildirimler */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sistem Bildirimleri</h2>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Bu bir demo uygulamasıdır. Gerçek zamanlı veri takibi ve tam analitik özellikler eklenmemiştir.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Sistem aktif ve çalışıyor. API servisleri online durumda.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Öneri motorunun performansı dönemsel olarak izlenmelidir. Soğuk başlangıç sorunları için yakın takip gereklidir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10">
        <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4">
          <h2 className="text-lg font-medium text-indigo-800 mb-2">Demo Uygulaması</h2>
          <p className="text-sm text-indigo-700">
            Bu admin paneli, gerçek bir uygulama için detaylı analitik veriler ve sistem yönetim özellikleri içerir. Ancak bu sürüm, akademik bitirme projesi için gösterim amaçlı hazırlanmıştır. Gerçek uygulamada daha kapsamlı veri analitiği, kullanıcı yönetimi ve sistem izleme araçları bulunacaktır.
          </p>
        </div>
      </div>
    </div>
  );
} 