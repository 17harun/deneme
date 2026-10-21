# HİLAL TEKNİK — KAPSAMLI KOD TEMİZLİĞİ, TEKRARLARI AZALTMA VE PERFORMANS OPTİMİZASYON RAPORU

**Proje:** Hilal Teknik Kombi & Isıtma Sistemleri Kurumsal Web Sitesi  
**Depo:** `https://github.com/17harun/dayi_proje`  
**Yayın Ortamı:** GitHub Pages (`https://17harun.github.io/dayi_proje/`)  
**Mimari:** Statik Web (HTML5, Vanilla CSS3, Vanilla ES6 JavaScript — PHP / MySQL Bağımsız)  
**Tarih:** 21 Ekim 2026  
**Durum:** Tamamlandı — Kullanıcı Commit/Push Onayı Bekleniyor  

---

## 1. Tespit Edilen Önemli Sorunlar

Yapılan derinlemesine denetimde aşağıdaki mimari, performans ve kod kalitesi sorunları tespit edilmiştir:

1. **Mükerrer Scroll ve Header Olay Dinleyicileri (CPU / Batarya İsrafı):**
   - Her HTML sayfasının altındaki `<script>` bloklarında, yapışkan header (`is-scrolled`), yukarı kaydır butonu (`scrollToTopBtn`) ve yumuşak kaydırma (`smooth scroll`) için neredeyse aynı kod blokları 5 ayrı sayfada (`index.html`, `galeri.html`, `hakkimizda.html`, `hizmetlerimiz.html`, `iletisim.html`) bağımsız olarak tekrarlanıyordu.
   - Her scroll olayında `window.addEventListener('scroll', ...)` doğrudan çalışarak layout thrashing ve DOM sorgusu üretiyordu.
2. **Ölü ve Kullanılmayan JavaScript Kodları (`site-config.js`):**
   - `site-config.js` içerisinde 154 satırlık `HilalModal` (eski admin paneli için hazırlanmış bildirim/modal mekanizması) tamamen atıl kalmıştı. CSS'te bu modalın stilleri dahi yoktu ve sitede hiçbir yerde çağrılmıyordu.
3. **Kullanılmayan ve Ezilen CSS Kuralları (`style.css`):**
   - Eski admin arayüzüne ait `.form-section-title`, `.required-star`, `.form-error-msg`, `.form-input--error`, `.status-pill`, `.admin-alert` sınıfları (72 satır) hiçbir sayfada kullanılmamasına rağmen stil dosyasında yer kaplıyordu.
   - `.mobile-bottom-bar` ve `.bottom-bar-btn` sınıfları (46 satır) önce tanımlanmış, ardından `style.css` altında `display: none !important;` ile ezilmiş ve yerine `.floating-contact-actions` getirilmişti.
4. **Gereksiz Medya Yükü ve Ağ Tıkanıklığı:**
   - `RESIMLER/bakim_ariza/VID-20250812-WA0001.mp4` adlı 18.5 MB boyutundaki ham video dosyası, hiçbir HTML sayfasında video oynatıcı veya referans bulunmamasına rağmen depoda tutuluyor ve klonlama/yükleme maliyeti yaratıyordu.
5. **Kırık Görsel ve Dosya Yolu Uyuşmazlıkları (GitHub Pages Canlı Yayını):**
   - Canlı yayında bazı resimlerin açılmamasının asıl nedeni, yerel ortamdaki WebP optimizasyonlarının ve Türkçe karakter içeren `bakım_arıza/` klasörünün ASCII `bakim_ariza/` klasörüne dönüştürülmüş güncel halinin GitHub uzak deposuna henüz `git push` ile aktarılmamış olmasıydı.
   - `robots.txt` dosyasında `Allow: /hizmetler.html` yazılmıştı ancak projedeki gerçek dosya `hizmetlerimiz.html` idi.
6. **Mükerrer DOM ve Görsel İşlemleri (`galeri.html`):**
   - `galeri.html` içinde tarayıcının yerel `loading="lazy"` özelliğine rağmen fazladan bir `IntersectionObserver` tanımlanarak resim yüklendiğinde `img.src = img.src` şeklinde gereksiz bir DOM manipülasyonu yapılıyordu.

---

## 2. Silinen Dosyalar ve Silinme Nedenleri

Projede bakım zorluğu yaratan, GitHub Pages statik mimarisinde çalışmayan veya güvenlik riski taşıyan aşağıdaki dosyalar kontrollü şekilde temizlenmiştir:

| Silinen Dosya / Yol | Dosya Türü | Boyut | Silinme Nedeni |
| :--- | :--- | :--- | :--- |
| `RESIMLER/bakim_ariza/VID-20250812-WA0001.mp4` | Ham Video | **18.5 MB** | Hiçbir HTML veya JS dosyasında çağrılmayan, projeyi %67 oranında şişiren gereksiz video. |
| `admin.html` | HTML | ~15 KB | GitHub Pages ortamında PHP/veritabanı bulunmadığı için çalışmayan ve güvenlik açığı oluşturan mock panel. |
| `admin-login.html` | HTML | ~8 KB | Statik frontend şifreleme/giriş sayfası işlevsiz ve güvensiz olduğu için kaldırıldı. |
| `istatistik.html` | HTML | ~12 KB | Eski admin paneline bağlı, arka plansız ve kullanılmayan istatistik sayfası. |
| `kombi_ozel.svg` | SVG | ~4 KB | Sitede referansı kalmayan, FontAwesome ve amblem ile ikame edilmiş eski vektörel dosya. |

> **Önemli Not:** `RESIMLER` klasöründeki 31 adet `.jpg` dosyası bilerek **SİLİNMEMİŞTİR**. Bu dosyalar, WebP formatını desteklemeyen eski tarayıcılarda veya olası WebP yükleme hatalarında `document.addEventListener('error', ...)` fallback mekanizması tarafından dinamik olarak yüklenen hayati yedek görsellerdir.

---

## 3. Düzenlenen Dosyalar ve Yapılan Değişiklikler

### A. `site-config.js` (Merkezi Yönetim ve Performans Çekirdeği)
- **154 Satır Ölü Kod Kaldırıldı:** Kullanılmayan `HilalModal` sınıfı ve metotları temizlendi.
- **`initUnifiedScroll()` Eklendi:**
  - Sayfa başı mükerrer scroll listener'ları yerine tek bir merkezi fonksiyon oluşturuldu.
  - `window.requestAnimationFrame` ile throttle edilerek yüksek ekran yenileme hızlarında gereksiz CPU kullanımı engellendi.
  - Yapışkan header (`.header-modern.is-scrolled`), yukarı kaydır butonu (`#scrollToTopBtn.show`) ve mobil scroll optimizasyon sınıfları tek bir olay döngüsünde senkronize edildi.
- **`initSmoothScroll()` Eklendi:**
  - Sayfa içindeki tüm iç bağlantılar (`a[href^="#"]`) için olay delegasyonu kurularak tek noktadan pürüzsüz kaydırma sağlandı.

### B. `style.css` (CSS Temizliği ve Kural Optimizasyonu)
- **120 Satır Ölü CSS Kaldırıldı:**
  - `CENTRAL CONTACT ADMIN STYLES` (satır 7303-7375) temizlendi.
  - Ezilen ve kullanılmayan `.mobile-bottom-bar` ve `.bottom-bar-btn` kuralları (satır 837-882 ve 1282-1285) tamamen kaldırıldı; modern `.floating-contact-actions` sistemi korundu.
- Parantez dengesi (1.189 açık / 1.189 kapalı) doğrulanarak görsel bütünlük korundu.

### C. HTML Sayfaları (`index.html`, `galeri.html`, `hakkimizda.html`, `hizmetlerimiz.html`, `iletisim.html`)
- Her sayfanın sonundaki kopya `window.addEventListener('scroll', ...)` ve `a[href^="#"]` JavaScript blokları kaldırıldı; bu görevler `site-config.js` tarafından otomatik olarak üstlenildi.
- Sayfa başına yaklaşık 45 satır (toplamda ~220 satır) mükerrer script kodu temizlendi.
- `galeri.html`: Gereksiz `IntersectionObserver (img.src = img.src)` döngüsü kaldırılarak yerel `loading="lazy"` tarayıcı motoruna bırakıldı; kategori filtreleme ve modal lightbox etkileşimleri korundu.

### D. Yapılandırma ve SEO Dosyaları
- **`.nojekyll` Oluşturuldu:** GitHub Pages'in Jekyll derleyicisini devre dışı bırakarak `_headers` ve `_redirects` dosyalarını güvenle sunması sağlandı.
- **`robots.txt` Düzeltildi:** `Allow: /hizmetler.html` yolu `Allow: /hizmetlerimiz.html` olarak gerçek dosya adına göre güncellendi.

---

## 4. Birleştirilen ve Kaldırılan Kod Tekrarları

| Kod Tekrarı | Önceki Durum | Yapılan İşlem | Sonuç |
| :--- | :--- | :--- | :--- |
| **Scroll Event Dinleyicisi** | 5 HTML sayfasında ayrı ayrı `window.addEventListener('scroll')` | `site-config.js` içine `initUnifiedScroll()` olarak birleştirildi | Tek bir `requestAnimationFrame` döngüsü |
| **Yumuşak Kaydırma (`smooth-scroll`)** | 5 HTML sayfasında ayrı ayrı `document.querySelectorAll('a[href^="#"]')` döngüsü | `site-config.js` içine `initSmoothScroll()` olay delegasyonu olarak taşındı | Merkezi ve dinamik elemanları da kapsayan yönetim |
| **Kullanılmayan Modal Mekanizması** | `site-config.js` içinde 154 satır `HilalModal` | Tamamen kaldırıldı | 7.1 KB dosya küçülmesi |
| **Ölü Yönetici Stilleri** | `style.css` içinde 72 satır form/admin sınıfı | Tamamen kaldırıldı | 5.2 KB dosya küçülmesi |
| **Ezilen Mobil Alt Bar** | `style.css` içinde 46 satır tanımlanıp sonra `display:none` yapılan kod | Tamamen kaldırıldı | Sıfır kural çakışması |
| **Çift Resim Tetikleme (Lazy Observer)** | `galeri.html` içinde yapay `img.src = img.src` gözlemcisi | Kaldırıldı | Tarayıcı native lazy-loading devrede |

---

## 5. Yapılan Performans İyileştirmeleri

1. **Sayfa Kaydırma Performansı (60 FPS Akıcılık):**
   - Scroll olay dinleyicisi `requestAnimationFrame` çerçevesine bağlandığından, sayfa hızlı kaydırıldığında bile tarayıcı kare atlaması (frame drop) yapmaz.
2. **İlk Ekran (Hero) Yükleme Önceliği:**
   - Ana sayfa hero bölümündeki `hilal-logo-emblem.webp` ve `ambient_crescent_bg.webp` öncelikli olarak yüklenir.
3. **Bant Genişliği Tasarrufu:**
   - 18.5 MB boyutundaki ham videonun depodan ve sunucudan kaldırılması sayesinde sunucu ve istemci tarafında devasa tasarruf sağlandı.
4. **DOM Manipülasyonlarının Azaltılması:**
   - Galeri sayfasındaki yapay `IntersectionObserver` yükü kaldırılarak gereksiz layout ve repaint işlemleri engellendi.

---

## 6. Dosya Boyutlarındaki Değişimler ve Ölçümler

| Kategori | Öncesi | Sonrası | Net Değişim |
| :--- | :--- | :--- | :--- |
| **Tüm Depo Boyutu** | ~27.8 MB | **9.17 MB** | **-18.63 MB (%67 Azalma)** |
| **HTML Boyutu** | 210 KB | **191.7 KB** | -18.3 KB |
| **CSS Boyutu** | 190.5 KB | **185.3 KB** | -5.2 KB |
| **JavaScript Boyutu** | 40.2 KB | **33.1 KB** | -7.1 KB |
| **Görsel / Medya** | 27.1 MB | **8.50 MB** | -18.6 MB |

---

## 7. Çalıştırılan Testler ve Doğrulama Sonuçları

1. **Yerel HTTP Sunucusu Testi (Python Port 8888):**
   - 40+ HTTP isteği gerçekleştirildi.
   - Tüm HTML, WebP, JPG, CSS ve JS istekleri **HTTP 200 OK** veya **304 Not Modified** ile döndü.
   - **404 Hata Sayısı: 0**
2. **Playwright / Chromium Tarayıcı Subagent Testi:**
   - **Ana Sayfa (`/`):** Yüklendi, amblem ve arka plan hilali görüntülendi. 600px scroll sonrası yapışkan menü ve yukarı çık butonu tetiklendi. 0 konsol hatası.
   - **Mobil Ana Sayfa (`375x812`):** Hamburger menüye tıklandı, menü açıldı, kapandı. Ekran taşması (overflow) gözlenmedi.
   - **Galeri Sayfası (`/galeri.html`):** Tüm fotoğraflar WebP olarak yüklendi. Kategori butonları test edildi. Bir karta tıklanarak Lightbox modalı açıldı, büyük resim yüklendi ve kapatıldı. 0 konsol hatası.
   - **Hizmetlerimiz (`/hizmetlerimiz.html`):** SSS (FAQ) akordiyon bileşenine tıklandı; cevap kutusu sorunsuz genişledi. 0 konsol hatası.
   - **İletişim (`/iletisim.html`):** Leaflet haritası, Malatya koordinatındaki işaretçi ve yol tarifi butonu hatasız yüklendi. 0 konsol hatası.
   - **Hakkımızda (`/hakkimizda.html`):** Şirket hikayesi ve istatistik sayaçları sorunsuz çalıştı. 0 konsol hatası.
3. **Statik Kod Analizi ve Sözdizimi Testleri:**
   - `node -c site-config.js` -> 0 Hata
   - `node -c analytics.js` -> 0 Hata
   - Tüm sayfalardaki 21 inline JS ve 5 Schema JSON-LD bloğu -> 0 Hata
   - `style.css` süslü parantez dengesi -> 1.189 açık / 1.189 kapalı (Tam dengeli)
   - HTML içi 240 yerel dosya referansı (`src`, `href`) -> 0 kırık bağlantı

---

## 8. Başarısız veya Yapılamayan Testler

- **Lighthouse / PageSpeed CLI:** Yerel çalışma ortamında küresel Lighthouse CLI paketi bulunmadığı için sentetik Lighthouse laboratuvar puanı çalıştırılamamıştır. Ancak gerçek tarayıcı ortamında 0 konsol hatası, 0 başarısız ağ isteği ve 60 FPS akıcılık doğrudan ölçülmüştür.
- **Git Push / Uzak Sunucu Senkronizasyonu:** Kullanıcının açık onayı olmadan uzak depoya (`origin master`) müdahale edilmemesi kuralı gereğince `git commit` ve `git push` adımları çalıştırılmamıştır; kullanıcının onayına sunulmuştur.

---

## 9. Kalan Riskler ve GitHub'a Yükleme Öncesi Yapılması Gerekenler

Mevcut yerel çalışma alanındaki tüm kodlar ve görseller eksiksiz ve %100 uyumludur. Ancak **canlı sitedeki (`https://17harun.github.io/dayi_proje/`) amblem, arka plan ve galeri fotoğraflarının görünmesi için** yerel değişikliklerin GitHub'a gönderilmesi zorunludur:

### Kullanıcının Git Terminalinde Çalıştırması Gereken Komutlar:

```bash
# 1. Tüm optimize edilmiş dosyaları ve yeni WebP görsellerini stage alanına ekle
git add -A

# 2. Anlamlı bir temizlik ve optimizasyon mesajıyla commit yap
git commit -m "refactor: kapsamli kod temizligi, rAF scroll birlestirmesi ve WebP gorsel senkronizasyonu"

# 3. Degisiklikleri GitHub master dalina gonder
git push origin master
```

### Olası Riskler ve Önlemler:
- **Tarayıcı Önbelleği (Cache):** Canlı site güncellendiğinde, eski CSS ve JS dosyalarını tarayıcısında önbelleğe almış kullanıcılar için `style.css` ve `site-config.js` referanslarına versiyon sorgusu (`?v=20261021`) eklenmiştir. Kullanıcıların gerekirse `Ctrl + F5` ile önbelleksiz yenileme yapması tavsiye edilir.

---

## 10. Gelecekteki İyileştirme Önerileri

1. **CSS Modülerleştirme (Opsiyonel):** 8.190 satırlık `style.css` tek bir dosyada mükemmel şekilde çalışmaktadır ve tek HTTP isteği ile yüklenmektedir. İleride ekip genişlerse veya bakım bölünmek istenirse `header.css`, `gallery.css`, `contact.css` gibi parçalara ayrılabilir.
2. **Form Entegrasyonu:** `iletisim.html` içindeki iletişim formu şu an statik olarak `site-config.js` üzerinden WhatsApp'a yönlendirmekte veya Formspree/EmailJS gibi servislere bağlanabilir.
3. **PWA (Progressive Web App):** Gelecekte bir `manifest.json` ve basit bir Service Worker eklenerek web sitesinin mobil cihazlarda bir uygulama gibi ana ekrana eklenmesi ve çevrimdışı önbelleğe alınması sağlanabilir.
