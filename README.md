# Reconus - Kişiselleştirilmiş Ürün Öneri Platformu

Bu proje, kişiselleştirilmiş ürün önerileri sunan bir akademik bitirme projesidir. Next.js (App Router) ve Tailwind CSS kullanılarak geliştirilmiştir.

## Özellikler

- Kullanıcı davranışlarına dayalı kişiselleştirilmiş ürün önerileri
- İçerik tabanlı ürün zenginleştirme (Amazon veri setiyle)
- Soğuk başlangıç senaryoları için fallback öneri stratejileri
- Ürün kategorilerine göre filtreleme ve çeşitli sıralama seçenekleri
- Responsive, modern arayüz tasarımı
- Admin paneli ile temel sistem metriklerinin görüntülenmesi

## Teknoloji Yığını

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, React Hooks
- **Backend/Veritabanı:** Supabase (PostgreSQL)
- **API'ler:** Reco API (öneri motoru), Catalog API (ürün metadatası)
- **Deployment:** Vercel

## Kurulum

1. Projeyi klonlayın:
   ```
   git clone https://github.com/kullaniciadi/reconus.git
   cd reconus
   ```

2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. `.env.local` dosyasını oluşturun ve şu değişkenleri ekleyin:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_RECO_API_URL=your_reco_api_url
   NEXT_PUBLIC_CATALOG_API_URL=your_catalog_api_url
   ```

4. Geliştirme sunucusunu başlatın:
   ```
   npm run dev
   ```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Uygulama Yapısı

```
/app
  /users               # Kullanıcı seçim sayfası
  /recommendations     # Öneri sonuçları sayfası
  /product/[id]        # Ürün detay sayfası
  /admin               # Admin gösterge paneli
/components            # React komponentleri
/hooks                 # Custom React hooks
/lib                   # Yardımcı fonksiyonlar
/types                 # Tip tanımlamaları
```

## Notlar

Bu proje bir akademik çalışmadır. Üretim ortamında kullanmadan önce güvenlik, performans ve ölçeklendirme konularında iyileştirmeler yapılmalıdır. 