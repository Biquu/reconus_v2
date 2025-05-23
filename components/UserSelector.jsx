'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../lib/supabaseClient';
import { FiUser, FiMapPin, FiStar, FiShoppingBag, FiPackage, FiClock, FiSearch, FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'; 
import { BiTimeFive } from 'react-icons/bi';
import { 
  Card, CardBody, CardHeader, CardFooter, Divider, 
  Spinner, Button, Input, Chip, Tooltip, Tabs, Tab,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Pagination, Badge, Progress, Select, SelectItem
} from "@nextui-org/react";

export default function UserSelector() {
  // State tanımları
  const [users, setUsers] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionStatus, setConnectionStatus] = useState({ checked: false, ok: false, message: "", logs: [] });
  const [page, setPage] = useState(1);
  const [debugMode, setDebugMode] = useState(false);
  // Kullanıcı sayısını 100'den 50'ye düşürüyoruz
  const topUserLimit = 25; // En çok sipariş veren 25 kullanıcı
  const coldUserLimit = 25; // Sadece 1 siparişi olan 25 kullanıcı
  const rowsPerPage = 10;
  const router = useRouter();
  
  // Bağlantının sadece bir kez yapılmasını garanti etmek için ref kullan
  const connectionInitiated = useRef(false);

  // Veritabanı bağlantı durumunu kontrol et - sadece bir kez çalışacak
  useEffect(() => {
    // Bağlantı daha önce başlatılmadıysa başlat
    if (!connectionInitiated.current) {
      connectionInitiated.current = true; // Ref ile bağlantı başlatıldı işaretle
      console.log("🔄 İlk bağlantı başlatılıyor...");
      checkConnection();
    }
  }, []); // Boş dependency array ile sadece mount olunca çalışacak

  // Veritabanı bağlantı kontrolü
  const checkConnection = async () => {
    // Bağlantı zaten yapılıyorsa çık
    if (connectionStatus.checked) {
      console.log("⏭️ Bağlantı zaten kontrol edilmiş, tekrar bağlanmaya gerek yok");
      return;
    }
    
    const logs = [];
    
    try {
      logs.push("Veritabanı bağlantısı başlatılıyor...");
      setConnectionStatus(prev => ({...prev, checked: true, logs: [...prev.logs, "Veritabanı bağlantısı başlatılıyor..."]})); // başlangıçta checked=true yap
      console.log("🔌 Veritabanı bağlantısı başlatılıyor...");
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "Tanımlanmamış";
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Tanımlı (gizli)" : "Tanımlanmamış";
      
      logs.push("Supabase URL: " + supabaseUrl);
      logs.push("Supabase Anon Key: " + supabaseKey);
      
      console.log("🌐 Supabase URL:", supabaseUrl);
      console.log("🔑 Supabase Anon Key durumu:", supabaseKey);
      
      const startTime = Date.now();
      console.log("⏱️ Bağlantı testi başlatılıyor...");
      
      // Önce basit bir sorguyla tablo varlığını ve erişimi kontrol et
      const { data, error } = await supabase.from('users_table').select('count').single();
      const endTime = Date.now();
      
      console.log("⏱️ Bağlantı testi tamamlandı. Süre:", (endTime - startTime) + "ms");
      
      if (error) {
        logs.push(`Bağlantı hatası: ${error.message}`);
        logs.push(`Hata kodu: ${error.code}`);
        console.error("❌ Bağlantı hatası:", error);
        console.error("❌ Hata detayı:", { 
          message: error.message, 
          code: error.code, 
          details: error.details,
          hint: error.hint
        });
        
        setConnectionStatus({
          checked: true,
          ok: false,
          message: `Bağlantı hatası: ${error.message}`,
          logs
        });
        throw error;
      }
      
      logs.push(`Bağlantı başarılı! Yanıt süresi: ${endTime - startTime}ms`);
      logs.push(`Kullanıcılar tablosu erişilebilir`);
      
      console.log("✅ Bağlantı başarılı! Yanıt süresi:", (endTime - startTime) + "ms");
      console.log("📋 Tablo erişim testi:", data);
      
      // Bağlantı durumunu güncelle ve kullanıcıları getir
      setConnectionStatus({
        checked: true,
        ok: true,
        message: "Veritabanı bağlantısı başarılı",
        logs
      });
      
      // Bağlantı başarılıysa kullanıcıları getir
      fetchUsers(logs);
    } catch (err) {
      console.error('❌ Veritabanı bağlantı hatası:', err);
      console.log("❌ Hata detayları:", JSON.stringify(err, null, 2));
      logs.push(`Bağlantı hatası: ${err.message || "Bilinmeyen hata"}`);
      
      setError('Veritabanı bağlantısı kurulamadı. Lütfen .env dosyasını kontrol edin.');
      setConnectionStatus(prev => ({
        ...prev, 
        checked: true,
        ok: false,
        message: `Bağlantı hatası: ${err.message || "Bilinmeyen hata"}`,
        logs
      }));
      setLoading(false);
    }
  };

  // Kullanıcıları getir - Veri yapısı değişikliği nedeniyle güncellendi (unique_items eklendi)
  const fetchUsers = async (existingLogs = []) => {
    const logs = [...existingLogs];
    
    try {
      setLoading(true);
      logs.push("Kullanıcı verileri yükleniyor...");
      console.log("📊 Kullanıcı verileri yükleniyor...");

      // RLS politikasını test et
      console.log("🔒 RLS politikası testi yapılıyor...");
      const { data: rlsTestData, error: rlsTestError } = await supabase
        .from('users_table')
        .select('count')
        .single();
        
      if (rlsTestError) {
        console.error("❌ RLS testi hatası:", rlsTestError);
        logs.push(`RLS politikası hatası: ${rlsTestError.message}`);
      } else {
        console.log("✅ RLS testi başarılı, toplam kayıt sayısı:", rlsTestData?.count || 0);
        logs.push(`RLS testi başarılı, toplam kayıt sayısı: ${rlsTestData?.count || 0}`);
      }

      // SORGU 1: Benzersiz ürün sayısı en fazla olan 25 kullanıcı
      logs.push(`Benzersiz ürün sayısı en fazla olan ${topUserLimit} kullanıcı sorgulanıyor...`);
      console.log(`🔍 SORGU 1: Benzersiz ürün sayısı en fazla olan ${topUserLimit} kullanıcı sorgulanıyor...`);
      
      const { data: topUsersData, error: topError } = await supabase
        .from('users_table')
        .select('user_id, city, state, total_orders, total_items, unique_items, avg_rating, last_purchase_ts')
        .gt('unique_items', 1) // Birden fazla benzersiz ürün alanlar
        .order('unique_items', { ascending: false }) // Benzersiz ürün sayısına göre sırala
        .limit(topUserLimit);
        
      if (topError) {
        console.error("❌ Üst kullanıcıları getirme hatası:", topError);
        logs.push(`Üst kullanıcıları getirme hatası: ${topError.message}`);
        throw topError;
      }
      
      // SORGU 2: Sadece 1 benzersiz ürün satın alan 25 kullanıcı (cold start)
      logs.push(`Sadece 1 benzersiz ürün satın alan ${coldUserLimit} kullanıcı sorgulanıyor...`);
      console.log(`🔍 SORGU 2: Sadece 1 benzersiz ürün satın alan ${coldUserLimit} kullanıcı sorgulanıyor...`);
      
      const { data: coldStartUsers, error: coldError } = await supabase
        .from('users_table')
        .select('user_id, city, state, total_orders, total_items, unique_items, avg_rating, last_purchase_ts')
        .eq('unique_items', 1) // Tam olarak 1 benzersiz ürün alanlar
        .limit(coldUserLimit);
        
      if (coldError) {
        console.error("❌ Cold start kullanıcılarını getirme hatası:", coldError);
        logs.push(`Cold start kullanıcılarını getirme hatası: ${coldError.message}`);
        throw coldError;
      }

      // İki sorgudan gelen verileri birleştir
      const allUsersData = [...(topUsersData || []), ...(coldStartUsers || [])];
      
      if (!allUsersData || allUsersData.length === 0) {
        console.warn("⚠️ Hiç kullanıcı bulunamadı. RLS politikalarını kontrol edin.");
        logs.push("Hiç kullanıcı bulunamadı. RLS politikalarını kontrol edin.");
      } else {
        console.log(`✅ Toplam ${allUsersData.length} kullanıcı yüklendi (${topUsersData?.length || 0} aktif, ${coldStartUsers?.length || 0} cold-start)`);
        logs.push(`Toplam ${allUsersData.length} kullanıcı yüklendi (${topUsersData?.length || 0} aktif, ${coldStartUsers?.length || 0} cold-start)`);
        
        setTopUsers(topUsersData || []);
        setNewUsers(coldStartUsers || []);
        setUsers(allUsersData || []);
      }
      
      setConnectionStatus(prev => ({...prev, logs: [...prev.logs, ...logs]}));
    } catch (err) {
      console.error('❌ Kullanıcılar alınırken hata oluştu:', err);
      console.log("❌ Hata detayları:", JSON.stringify(err, null, 2));
      logs.push(`Kullanıcı verilerini getirme hatası: ${err.message}`);
      setError('Kullanıcı verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      setConnectionStatus(prev => ({...prev, logs: [...prev.logs, ...logs]}));
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı seçimi
  const handleUserSelect = (e) => {
    setSelectedUser(e.target.value);
  };

  // Önerileri görüntüle
  const handleGetRecommendations = () => {
    if (selectedUser) {
      router.push(`/recommendations?user_id=${selectedUser}`);
    }
  };

  // Arama filtreleme
  const filteredUsers = useMemo(() => {
    const baseUsers = activeTab === "all" ? users : activeTab === "top" ? topUsers : newUsers;
    
    if (!searchQuery.trim()) return baseUsers;
    
    return baseUsers.filter(user => 
      user.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.state.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, topUsers, newUsers, activeTab, searchQuery]);
  
  // Sayfalama
  const pages = Math.ceil(filteredUsers.length / rowsPerPage) || 1; // En az 1 sayfa olsun
  const currentPageItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [page, filteredUsers, rowsPerPage]);

  // Tarih formatla
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  // Benzersiz ürün sayısına göre puanı hesapla (görsel gösterim için)
  const calculateUniqueItemScore = (uniqueItems) => {
    const maxItems = Math.max(...users.map(u => u.unique_items || 0));
    return maxItems > 0 ? (uniqueItems / maxItems) * 100 : 0;
  };

  // Yükleme durumu gösterimi
  if (loading) {
    return (
      <Card className="w-full border-none bg-black/40 dark:bg-default-100/50 shadow-md">
        <CardBody className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <Spinner size="lg" color="white" />
            <p className="text-white mt-4 text-lg">Kullanıcı verileri yükleniyor...</p>
            <div className="mt-3 text-gray-400 text-sm">Supabase veritabanına bağlanılıyor</div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Hata durumu gösterimi
  if (error) {
    return (
      <Card className="w-full border-none bg-red-900/20 dark:bg-red-900/10 shadow-md">
        <CardHeader className="flex gap-3 text-red-500">
          <FiAlertCircle className="w-6 h-6" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Bağlantı Hatası</p>
            <p className="text-small text-red-400">Veritabanına erişilemedi</p>
          </div>
        </CardHeader>
        <Divider className="bg-red-800/20" />
        <CardBody>
          <p className="text-red-400 mb-4">{error}</p>
          
          {connectionStatus.checked && !connectionStatus.ok && (
            <div className="mt-2 p-4 bg-red-900/10 border border-red-800/20 rounded-lg">
              <p className="text-red-300 text-sm mb-3">{connectionStatus.message}</p>
              <p className="text-red-300 text-sm font-semibold">Olası Çözümler:</p>
              <ul className="list-disc pl-5 mt-2 text-red-300 text-sm space-y-1">
                <li>.env.local dosyasındaki Supabase bağlantı bilgilerini kontrol edin</li>
                <li>Supabase projenizin aktif olduğundan emin olun</li>
                <li>Ağ bağlantınızı kontrol edin</li>
              </ul>
              
              <div className="mt-4">
                <Button 
                  color="danger" 
                  variant="flat" 
                  onClick={() => setDebugMode(!debugMode)}
                  startContent={<FiInfo />}
                >
                  {debugMode ? "Hata Bilgilerini Gizle" : "Hata Detaylarını Göster"}
                </Button>
              </div>
              
              {debugMode && connectionStatus.logs.length > 0 && (
                <div className="mt-4 p-3 bg-black/60 rounded-lg font-mono text-xs text-red-300 h-[200px] overflow-y-auto">
                  {connectionStatus.logs.map((log, index) => (
                    <div key={index} className="py-1 border-b border-red-900/30">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardBody>
        <Divider className="bg-red-800/20" />
        <CardFooter>
          <Button 
            color="danger" 
            variant="flat" 
            onClick={checkConnection}
            startContent={<FiAlertCircle />}
          >
            Bağlantıyı Yeniden Dene
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Başarılı durum gösterimi
  return (
    <div className="space-y-3 p-6 bg-black/30 rounded-lg border border-zinc-800">
      {/* Debug modu ve bağlantı bilgileri sadece debug açıksa göster */}
      {debugMode && connectionStatus.checked && connectionStatus.ok && (
        <div className="bg-zinc-900 p-2 rounded-md border border-green-800 text-sm flex items-center">
          <FiCheckCircle className="text-green-500 mr-2" />
          <span className="text-green-400">{connectionStatus.message}</span>
        </div>
      )}
      
      {/* Debug modu gösterimi */}
      {debugMode && connectionStatus.logs.length > 0 && (
        <div className="bg-zinc-900 p-3 rounded-md border border-zinc-800 text-sm mb-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-300 font-medium">Bağlantı Logları</h3>
            <Button 
              size="sm" 
              variant="flat" 
              color="default" 
              onClick={() => setDebugMode(false)}
            >
              Gizle
            </Button>
          </div>
          <div className="h-[150px] overflow-y-auto font-mono text-xs text-gray-400 bg-black/30 p-2 rounded">
            {connectionStatus.logs.map((log, index) => (
              <div key={index} className="py-1 border-b border-zinc-800">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Kullanıcılar Başlığı */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Kullanıcılar</h2>
          <p className="text-gray-400 text-sm">Öneriler için kullanıcı profili seçin</p>
        </div>
        
        {/* Debug düğmesi başlık kısmına taşındı */}
        <button
          onClick={() => setDebugMode(!debugMode)}
          className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          title="Log Detaylarını Göster/Gizle"
        >
          <FiInfo size={14} />
          <span className="text-sm">Logs</span>
        </button>
      </div>
      
      {/* Arama kutusu - sağa hizalanmış */}
      <div className="flex items-center mb-6 justify-end">
        <div className="relative w-64">
          <div className="flex items-center bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
            <div className="flex items-center justify-center h-full px-3 text-gray-400">
              <FiSearch size={18} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pr-10 bg-transparent border-none text-white focus:outline-none text-sm"
            />
            {searchQuery && (
              <div className="flex items-center h-full px-3">
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-zinc-700"
                  title="Aramayı Temizle"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tablo Container */}
      <div className="overflow-hidden rounded-lg border border-zinc-800">
        {/* Filtreleme sekmeleri - tablo ile bütünleşik */}
        <div className="flex overflow-hidden border-b border-zinc-800">
          <button 
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium transition-colors ${
              activeTab === "all" 
                ? "bg-zinc-800 text-white border-b-2 border-cyan-400" 
                : "bg-zinc-900/60 text-gray-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            Tüm Kullanıcılar ({users.length})
          </button>
          <button 
            onClick={() => setActiveTab("top")}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium transition-colors ${
              activeTab === "top" 
                ? "bg-zinc-800 text-white border-b-2 border-cyan-400" 
                : "bg-zinc-900/60 text-gray-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            Aktif Kullanıcılar ({topUsers.length})
          </button>
          <button 
            onClick={() => setActiveTab("new")}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium transition-colors ${
              activeTab === "new" 
                ? "bg-zinc-800 text-white border-b-2 border-cyan-400" 
                : "bg-zinc-900/60 text-gray-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            Cold Start ({newUsers.length})
          </button>
        </div>
        
        {/* Tablo başlıkları ve veriler - sekmelere yapışık */}
        <div className="bg-zinc-900">
          {/* Kullanıcı listesi */}
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <div className="p-3 inline-flex rounded-full bg-yellow-500/10 text-yellow-500 mb-4">
                <FiAlertCircle size={24} />
              </div>
              <p className="text-yellow-200 mb-2">Kullanıcı bulunamadı</p>
              <p className="text-gray-400 text-sm">Veritabanı bağlantınızı ve RLS politikalarını kontrol edin</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">Kullanıcı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">Konum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">Ürünler</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">Puan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">Son Alışveriş</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-cyan-400 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {currentPageItems.map((user) => (
                    <tr key={user.user_id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-mono">{user.user_id.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiMapPin className="text-gray-500 mr-1" size={14} />
                          <div className="text-sm text-white">{user.city}, {user.state}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{user.unique_items}</div>
                        <div className="w-16 h-1 bg-zinc-800 rounded-full mt-1">
                          <div 
                            className={`h-1 rounded-full ${user.unique_items > 10 ? 'bg-cyan-500' : 'bg-cyan-400'}`}
                            style={{ width: `${calculateUniqueItemScore(user.unique_items)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiStar className="text-yellow-500 mr-1" size={14} />
                          <span className="text-sm text-white">{user.avg_rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatDate(user.last_purchase_ts)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-end">
                          <button
                            className="px-4 py-1.5 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors"
                            onClick={() => {
                              setSelectedUser(user.user_id);
                              handleGetRecommendations();
                            }}
                          >
                            Önerileri Gör
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Sayfalama */}
          {pages > 1 && (
            <div className="px-6 py-4 bg-zinc-800 flex justify-between items-center border-t border-zinc-700">
              <div className="text-sm text-gray-400">
                Toplam: {filteredUsers.length} kullanıcı
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${page === 1 ? 'text-gray-600 bg-zinc-900 cursor-not-allowed' : 'text-white bg-zinc-700 hover:bg-zinc-600'}`}
                >
                  &lt;
                </button>
                
                {Array.from({ length: Math.min(5, pages) }).map((_, i) => {
                  // Sayfa numaralarını doğru şekilde hesapla
                  let pageNum;
                  if (pages <= 5) {
                    // 5 veya daha az sayfa varsa, tüm sayfaları göster
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    // Başlangıçtayız, ilk 5 sayfayı göster
                    pageNum = i + 1;
                  } else if (page >= pages - 2) {
                    // Sondayız, son 5 sayfayı göster
                    pageNum = pages - 4 + i;
                  } else {
                    // Ortadayız, mevcut sayfayı ortada göster
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button 
                      key={i} 
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${page === pageNum ? 'bg-cyan-500 text-white' : 'bg-zinc-700 text-white hover:bg-zinc-600'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => setPage(Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${page === pages ? 'text-gray-600 bg-zinc-900 cursor-not-allowed' : 'text-white bg-zinc-700 hover:bg-zinc-600'}`}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 