'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import supabase from '../../lib/supabaseClient';
import { 
  getRecommendationsForUser, 
  getBoughtTogetherProducts, 
  getUserPopularProducts 
} from '../../lib/recoApiService';
import { 
  Button, 
  Chip,
  Spinner,
  Card, 
  CardBody, 
  Image
} from '@nextui-org/react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { FiUser, FiPackage, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';

// Varsayılan ürün görseli
const DEFAULT_PRODUCT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%232C2C2C'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23757575'%3EÜrün Yok%3C/text%3E%3C/svg%3E";

export default function RecommendationsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id') || '';

  // Kullanıcının satın aldığı ürünler için state'ler
  const [userPurchasedProducts, setUserPurchasedProducts] = useState([]);
  const [purchasedLoading, setPurchasedLoading] = useState(true);
  const [purchasedError, setPurchasedError] = useState(null);

  // Öneri tipleri için state'ler
  const [personalRecs, setPersonalRecs] = useState([]);
  const [boughtTogetherRecs, setBoughtTogetherRecs] = useState([]);
  const [userPopularRecs, setUserPopularRecs] = useState([]);
  
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Carousel referansları
  const purchasedRef = useRef(null);
  const personalRef = useRef(null);
  const boughtTogetherRef = useRef(null);
  const userPopularRef = useRef(null);

  // Satın alınan ürünleri çekme
  useEffect(() => {
    async function fetchUserPurchasedProducts() {
      if (!userId) {
        setPurchasedLoading(false);
        setUserPurchasedProducts([]);
        return;
      }
      setPurchasedLoading(true);
      setPurchasedError(null);
      try {
        const { data: userData, error: userError } = await supabase
          .from('users_table')
          .select('purchased_json')
          .eq('user_id', userId)
          .single();
        if (userError) throw userError;

        if (userData && userData.purchased_json) {
          let purchasedItems = [];
          try {
            purchasedItems = typeof userData.purchased_json === 'string' 
              ? JSON.parse(userData.purchased_json) 
              : userData.purchased_json;
          } catch (e) {
            console.error('Satın alınanlar JSON parse hatası:', e);
            purchasedItems = [];
          }

          if (purchasedItems.length > 0) {
            const uniqueProductIds = [...new Set(purchasedItems.map(item => item.product_id))];
            const { data: productsData, error: productsError } = await supabase
              .from('product_table')
              .select('*')
              .in('product_id', uniqueProductIds);
            if (productsError) throw productsError;
            
            const productCounts = purchasedItems.reduce((acc, item) => {
              acc[item.product_id] = (acc[item.product_id] || 0) + 1;
              return acc;
            }, {});

            const enrichedProducts = productsData.map(p => ({ 
              ...p, 
              purchase_count: productCounts[p.product_id] || 1 
            }));
            setUserPurchasedProducts(enrichedProducts);
          } else {
            setUserPurchasedProducts([]);
          }
        } else {
          setUserPurchasedProducts([]);
        }
      } catch (err) {
        console.error('Kullanıcı ürünleri alınırken hata:', err);
        setPurchasedError('Satın alınan ürünler yüklenirken bir sorun oluştu.');
        setUserPurchasedProducts([]);
      } finally {
        setPurchasedLoading(false);
      }
    }
    fetchUserPurchasedProducts();
  }, [userId]);

  // Tüm öneri tiplerini getirme fonksiyonu
  const fetchAllRecommendations = async () => {
    if (!userId) return;
    setRecommendationsLoading(true);
    setRecommendationsError(null);
    setShowRecommendations(true);
    
    setPersonalRecs([]);
    setBoughtTogetherRecs([]);
    setUserPopularRecs([]);

    try {
      const [personal, bought, popular] = await Promise.allSettled([
        getRecommendationsForUser(userId, 15),
        getBoughtTogetherProducts(userId, 15),
        getUserPopularProducts(userId, 15)
      ]);

      if (personal.status === 'fulfilled' && Array.isArray(personal.value)) {
        setPersonalRecs(personal.value);
      } else {
        console.warn('Kişisel öneriler alınamadı:', personal.reason);
      }

      if (bought.status === 'fulfilled' && Array.isArray(bought.value)) {
        setBoughtTogetherRecs(bought.value);
      } else {
        console.warn('Birlikte alınanlar alınamadı:', bought.reason);
      }

      if (popular.status === 'fulfilled' && Array.isArray(popular.value)) {
        setUserPopularRecs(popular.value);
      } else {
        console.warn('Kullanıcı popülerleri alınamadı:', popular.reason);
      }

      if (personal.status === 'rejected' && bought.status === 'rejected' && popular.status === 'rejected') {
        setRecommendationsError('Öneriler yüklenirken bir sorun oluştu. API bağlantısını kontrol edin.');
      }

    } catch (err) {
      console.error('Öneriler çekilirken genel hata:', err);
      setRecommendationsError('Öneriler yüklenirken beklenmedik bir sorun oluştu.');
    } finally {
      setRecommendationsLoading(false);
    }
  };
  
  // Ürün Kartı Render Fonksiyonu
  const ProductCard = ({ product, recommendationType }) => {
    let chipColor = "primary";
    let chipText = "";

    if (recommendationType === 'personal') { chipColor = "success"; chipText = "Kişisel Öneri"; }
    else if (recommendationType === 'bought_together') { chipColor = "warning"; chipText = "Birlikte Alınan"; }
    else if (recommendationType === 'user_popular') { chipColor = "secondary"; chipText = "Popüler"; }

    return (
      <div className="w-[240px] h-[430px] flex flex-col">
        <Card 
          className="w-full h-full bg-zinc-800 flex flex-col rounded-lg border border-zinc-700 shadow-md hover:shadow-lg hover:border-zinc-600 transition-all duration-300 ease-in-out"
          isPressable
        >
          <CardBody className="relative w-full h-40 flex items-center justify-center bg-zinc-900 rounded-t-lg p-2">
            {recommendationType && (
              <Chip size="sm" color={chipColor} variant="flat" className="absolute top-2 right-2 z-10">
                {chipText}
              </Chip>
            )}
            <Image
              alt={product.title_from_amazon || 'Ürün görseli'}
              className="object-contain w-full h-full"
              src={product.imgUrl_from_amazon || DEFAULT_PRODUCT_IMAGE}
              fallbackSrc={DEFAULT_PRODUCT_IMAGE}
              height={160} 
              width={160}
              style={{ objectFit: "contain" }}
              removeWrapper
            />
          </CardBody>
          <div className="flex flex-col flex-grow p-3">
            <h4 className="font-medium text-sm text-white h-10 line-clamp-2 overflow-hidden">
              {product.title_from_amazon && product.title_from_amazon.length > 50
                ? product.title_from_amazon.substring(0, 50) + '...'
                : (product.title_from_amazon || 'Ürün adı yok')}
            </h4>
            <p className="text-xs text-gray-400 h-4 line-clamp-1 overflow-hidden">
              {product.category_name || <>&nbsp;</>}
            </p>
            <div className="text-xs text-gray-400 h-4 min-h-[16px]">
              {product.avg_rating > 0 ? (
                <div className="flex items-center">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xs">{i < Math.floor(product.avg_rating || 0) ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="ml-1 text-gray-400 text-xs">({product.num_reviews || 0})</span>
                </div>
              ) : <>&nbsp;</>}
            </div>
            <div className="w-full flex justify-between items-center pt-1.5 border-t border-zinc-700 mt-auto h-8">
              <p className="text-base font-bold text-white">
                {product.median_price ? `$${product.median_price.toFixed(2)}` : 'Fiyat Yok'}
              </p>
              {product.purchase_count > 1 && !recommendationType && (
                <Chip size="sm" variant="flat" className="bg-blue-900/60 text-blue-200 border border-blue-800">
                  {product.purchase_count}x alındı
                </Chip>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Carousel Render Fonksiyonu
  const CarouselSection = ({ title, products, loading, error, sectionRef, icon, recommendationType, emptyMessage, description }) => {
    const VISIBLE_CARDS_COUNT = 6;
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(products.length / VISIBLE_CARDS_COUNT);

    const visibleProducts = products.slice(
      currentPage * VISIBLE_CARDS_COUNT,
      (currentPage + 1) * VISIBLE_CARDS_COUNT
    );

    if (loading) {
      return (
        <div className="mb-10">
          <div className="flex items-center mb-3">
            {icon && <span className="mr-2 text-xl text-gray-400">{icon}</span>}
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <div className="flex justify-center items-center h-56 bg-zinc-800/30 rounded-lg border border-zinc-700">
            <Spinner color="primary" />
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="mb-10">
          <div className="flex items-center mb-3">
            {icon && <span className="mr-2 text-xl text-gray-400">{icon}</span>}
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (products.length === 0 && !loading) {
        return (
          <div className="mb-10">
            <div className="flex items-center mb-3">
              {icon && <span className="mr-2 text-xl text-gray-400">{icon}</span>}
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
            <div className="text-center py-10 bg-zinc-800/30 rounded-lg border border-zinc-700">
              <p className="text-gray-400">{emptyMessage || `${title} için gösterilecek ürün bulunamadı.`}</p>
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
          </div>
        );
    }

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                {icon && <span className="mr-3 text-2xl text-gray-300">{icon}</span>}
                <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
            </div>
        </div>
        {description && <p className="text-sm text-gray-400 mb-4 -mt-2">{description}</p>}
        <div className="relative w-full">
          <div className="flex items-center justify-between mb-2">
            <Button
              isIconOnly
              className="bg-black/60 hover:bg-black/80 text-white rounded-full shadow-lg"
              size="md"
              aria-label={`Önceki ${title}`}
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <IoChevronBackOutline size={22} />
            </Button>
            <span className="text-xs text-gray-400">{currentPage + 1} / {totalPages}</span>
            <Button
              isIconOnly
              className="bg-black/60 hover:bg-black/80 text-white rounded-full shadow-lg"
              size="md"
              aria-label={`Sonraki ${title}`}
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <IoChevronForwardOutline size={22} />
            </Button>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="flex flex-row flex-nowrap gap-4">
              {visibleProducts.map((product, index) => (
                <div className="w-[240px] h-[430px] flex-shrink-0">
                  <ProductCard key={`${product.product_id}-${index}-${recommendationType || 'purchased'}`} product={product} recommendationType={recommendationType} />
                </div>
              ))}
              {/* Eksik ürün varsa boş kutu ile tamamla */}
              {Array.from({length: Math.max(0, 6 - visibleProducts.length)}).map((_, i) => (
                <div className="w-[240px] h-[430px] flex-shrink-0" key={`empty-${i}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sayfa Başlığı ve Kullanıcı ID useEffect
  useEffect(() => {
    if (!userId) {
      document.title = 'Ürün Önerileri - Reconus';
    } else {
      document.title = `${userId.substring(0, 8)}... için Öneriler - Reconus`;
    }
  }, [userId]);
  
  return (
    <div className="bg-black min-h-screen w-full text-white">
      <header className="bg-black/80 backdrop-blur-md py-3 sticky top-0 z-50 shadow-md border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-white">Ürün Öneri Sistemi</h1>
              {userId && (
                <p className="text-xs text-blue-300 mt-0.5">
                  Kullanıcı ID: <span className="font-mono">{userId.substring(0,12)}...</span>
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              {userId && !showRecommendations && (
                <Button 
                  color="success"
                  variant="flat"
                  size="sm"
                  className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30"
                  onClick={fetchAllRecommendations}
                  isLoading={recommendationsLoading}
                  disabled={recommendationsLoading}
                >
                  {recommendationsLoading ? 'Öneriler Yükleniyor...' : 'Tüm Önerileri Getir'}
                </Button>
              )}
              <Button 
                as={Link}
                href="/users" 
                color="default"
                variant="flat"
                size="sm"
                className="bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30"
              >
                {userId ? 'Farklı Kullanıcı' : 'Kullanıcı Seç'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!userId ? (
          <div className="max-w-md mx-auto bg-zinc-900/50 p-8 rounded-lg border border-zinc-800 text-center mt-10 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-sky-300">Kullanıcı Seçilmedi</h2>
            <p className="text-gray-400 mb-6">Ürünlerinizi ve size özel önerileri görmek için lütfen bir kullanıcı seçin.</p>
            <Button 
              as={Link}
              href="/users" 
              color="primary"
              variant="shadow"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold"
              startContent={<FiUser />}
            >
              Kullanıcı Seçim Sayfasına Git
            </Button>
          </div>
        ) : (
          <>
            <CarouselSection
              title="Satın Aldığınız Ürünler"
              products={userPurchasedProducts}
              loading={purchasedLoading}
              error={purchasedError}
              sectionRef={purchasedRef}
              icon={<FiShoppingBag />}
              emptyMessage="Bu kullanıcının daha önce satın aldığı ürün bulunmuyor."
              description="Geçmişte satın aldığınız ürünlerin bir özeti."
            />

            {showRecommendations && (
              <div className="mt-10 pt-8 border-t border-zinc-800">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                    Size Özel Öneriler
                </h2>
                <p className="text-gray-400 mb-8">Satın alma geçmişiniz ve ilgi alanlarınıza göre hazırlanmış ürün önerileri.</p>
                
                {recommendationsLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Spinner label="Öneriler yükleniyor..." color="success" labelColor="success"/>
                    </div>
                )}
                {recommendationsError && !recommendationsLoading && (
                    <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg shadow-sm mb-6" role="alert">
                        <strong className="font-bold">Hata! </strong>
                        <span className="block sm:inline">{recommendationsError}</span>
                    </div>
                )}

                {!recommendationsLoading && !recommendationsError && (
                  <>
                    <CarouselSection
                      title="Kişiselleştirilmiş Öneriler"
                      products={personalRecs}
                      loading={false} // Ana yükleme durumu yukarıda hallediliyor
                      error={null}    // Ana hata durumu yukarıda hallediliyor
                      sectionRef={personalRef}
                      icon={<FiUser className="text-green-400"/>}
                      recommendationType="personal"
                      emptyMessage="Size özel kişiselleştirilmiş öneri bulunamadı."
                      description="Beğenebileceğinizi düşündüğümüz, size özel seçilmiş ürünler."
                    />
                    <CarouselSection
                      title="Birlikte Satın Alınanlar"
                      products={boughtTogetherRecs}
                      loading={false}
                      error={null}
                      sectionRef={boughtTogetherRef}
                      icon={<FiPackage className="text-orange-400"/>}
                      recommendationType="bought_together"
                      emptyMessage="Sıkça birlikte alınan ürün önerisi bulunamadı."
                      description="Bu ürünleri alanlar bunları da aldı!"
                    />
                    <CarouselSection
                      title="İlgilenebileceğiniz Popüler Ürünler"
                      products={userPopularRecs}
                      loading={false}
                      error={null}
                      sectionRef={userPopularRef}
                      icon={<FiTrendingUp className="text-purple-400"/>}
                      recommendationType="user_popular"
                      emptyMessage="İlgilendiğiniz kategorilerde popüler ürün önerisi bulunamadı."
                      description="Genellikle göz attığınız kategorilerdeki popüler ürünler."
                    />
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
      `}</style>
    </div>
  );
}
